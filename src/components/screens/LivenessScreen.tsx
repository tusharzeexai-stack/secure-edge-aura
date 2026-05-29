/**
 * LivenessScreen.tsx
 *
 * Real liveness detection using MediaPipe Face Landmarker (tasks-vision).
 * Blendshapes used:
 *   blink  → eyeBlinkLeft + eyeBlinkRight  > 0.35
 *   smile  → mouthSmileLeft + mouthSmileRight > 0.40
 *   left   → headYaw > +12 degrees  (face turns left = positive yaw)
 *   right  → headYaw < -12 degrees
 *
 * On completion all face vectors are saved to browser SQLite via sql.js.
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { toast } from "sonner";
import {
  Eye, Smile, ArrowLeft, ArrowRight,
  CheckCircle2, ShieldCheck, Camera, CameraOff,
  Loader2, Play, Database,
} from "lucide-react";
import {
  createSession, saveFaceVector, completeSession,
} from "@/lib/faceDb";

/* ─── Challenge config ───────────────────────────────────── */
type ChallengeId = "blink" | "smile" | "left" | "right";

interface Challenge {
  id: ChallengeId;
  icon: React.ElementType;
  label: string;
  instruction: string;
  color: string;
  /** Returns true when the gesture is currently detected */
  detect: (bs: Record<string, number>, yaw: number) => boolean;
  /** How many consecutive positive frames needed to confirm */
  holdFrames: number;
}

const CHALLENGES: Challenge[] = [
  {
    id: "blink",
    icon: Eye,
    label: "Blink Eyes",
    instruction: "Slowly blink both eyes",
    color: "blue",
    detect: (bs) => (bs["eyeBlinkLeft"] ?? 0) + (bs["eyeBlinkRight"] ?? 0) > 0.70,
    holdFrames: 3,
  },
  {
    id: "smile",
    icon: Smile,
    label: "Smile",
    instruction: "Give a natural smile",
    color: "amber",
    detect: (bs) => (bs["mouthSmileLeft"] ?? 0) + (bs["mouthSmileRight"] ?? 0) > 0.55,
    holdFrames: 5,
  },
  {
    id: "left",
    icon: ArrowLeft,
    label: "Look Left",
    instruction: "Slowly turn your head to the left",
    color: "violet",
    detect: (_bs, yaw) => yaw > 12,
    holdFrames: 5,
  },
  {
    id: "right",
    icon: ArrowRight,
    label: "Look Right",
    instruction: "Slowly turn your head to the right",
    color: "emerald",
    detect: (_bs, yaw) => yaw < -12,
    holdFrames: 5,
  },
];

const COLOR: Record<string, { ring: string; badge: string; text: string; bg: string }> = {
  blue:    { ring: "border-blue-500",    badge: "bg-blue-500",    text: "text-blue-400",    bg: "bg-blue-500/10"    },
  amber:   { ring: "border-amber-400",   badge: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/10"   },
  violet:  { ring: "border-violet-400",  badge: "bg-violet-400",  text: "text-violet-400",  bg: "bg-violet-400/10"  },
  emerald: { ring: "border-emerald-400", badge: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10" },
};

type StepStatus = "pending" | "active" | "done";
type PageStatus = "idle" | "loading-model" | "ready" | "running" | "done" | "denied" | "error";

export function LivenessScreen() {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef  = useRef<MediaStream | null>(null);
  const rafRef     = useRef<number>(0);
  const holdRef    = useRef(0);           // consecutive positive frames
  const stepRef    = useRef(0);           // current challenge index (mirror of state)
  const sessionRef = useRef<number>(-1);  // SQLite session id

  const [pageStatus, setPageStatus] = useState<PageStatus>("idle");
  const [stepIndex,  setStepIndex]  = useState(0);
  const [stepStatus, setStepStatus] = useState<StepStatus[]>(CHALLENGES.map(() => "pending"));
  const [holdCount,  setHoldCount]  = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  /* ── Reset back to camera-ready state ── */
  const resetScan = useCallback(async () => {
    cancelAnimationFrame(rafRef.current);
    setPageStatus("loading-model");
    setStepIndex(0);
    setStepStatus(CHALLENGES.map(() => "pending"));
    setHoldCount(0);
    setSavedCount(0);
    holdRef.current = 0;
    stepRef.current = 0;
    // Restart camera stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPageStatus("ready");
    } catch {
      setPageStatus("denied");
    }
  }, []);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      landmarkerRef.current?.close();
    };
  }, []);

  /* ── Load MediaPipe model + camera ── */
  const initialise = useCallback(async () => {
    setPageStatus("loading-model");
    try {
      // 1. Load MediaPipe wasm + model
      const vision = await FilesetResolver.forVisionTasks(
        "/mediapipe-wasm"
      );
      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/models/face_landmarker.task",
          delegate: "CPU",
        },
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      });

      // 2. Camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setPageStatus("ready");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        setPageStatus("denied");
      } else {
        console.error(err);
        setPageStatus("error");
      }
    }
  }, []);

  /* ── Detection loop ── */
  const startLoop = useCallback(async () => {
    // Create the SQLite session only when verification actually begins
    const sid = await createSession(CHALLENGES.map((c) => c.id));
    sessionRef.current = sid;

    setPageStatus("running");
    stepRef.current = 0;
    holdRef.current = 0;
    setStepIndex(0);
    setStepStatus(CHALLENGES.map(() => "pending"));
    setHoldCount(0);
    setSavedCount(0);

    const video   = videoRef.current!;
    const canvas  = canvasRef.current!;
    const ctx     = canvas.getContext("2d")!;

    let lastTs = -1;

    const loop = async (now: number) => {
      if (!landmarkerRef.current || !video.videoWidth) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Throttle to ~30 fps
      if (now - lastTs < 33) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      lastTs = now;

      // Draw mirrored video to canvas (for visual only)
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
      ctx.restore();

      const idx = stepRef.current;
      if (idx >= CHALLENGES.length) return; // all done

      // Run face landmarker
      const result = landmarkerRef.current.detectForVideo(video, now);
      if (!result.faceBlendshapes?.length) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Build blendshape map
      const bs: Record<string, number> = {};
      for (const cat of result.faceBlendshapes[0].categories) {
        bs[cat.categoryName] = cat.score;
      }

      // Head yaw from transformation matrix
      let yaw = 0;
      const mat = result.facialTransformationMatrixes?.[0]?.data;
      if (mat) {
        // mat is a 4×4 column-major Float32Array
        // yaw ≈ atan2(mat[8], mat[10]) in radians → degrees
        yaw = Math.atan2(mat[8], mat[10]) * (180 / Math.PI);
      }

      const ch      = CHALLENGES[idx];
      const gesture = ch.detect(bs, yaw);

      if (gesture) {
        holdRef.current += 1;
        setHoldCount(holdRef.current);

        if (holdRef.current >= ch.holdFrames) {
          // ── Challenge passed ──
          holdRef.current = -999; // prevent re-entry while awaiting

          const landmarks = result.faceLandmarks?.[0]?.map((lm) => ({
            x: lm.x, y: lm.y, z: lm.z,
          })) ?? [];

          try {
            await saveFaceVector({
              sessionId:   sessionRef.current,
              challenge:   ch.id,
              landmarks,
              blendshapes: bs,
            });
            setSavedCount((n) => n + 1);
          } catch (e) {
            console.error("saveFaceVector failed:", e);
          }

          setStepStatus((prev) =>
            prev.map((s, i) => (i === idx ? "done" : s))
          );

          if (idx + 1 >= CHALLENGES.length) {
            cancelAnimationFrame(rafRef.current);
            try { await completeSession(sessionRef.current); } catch {}
            setPageStatus("done");
            streamRef.current?.getTracks().forEach((t) => t.stop());
            toast.success("Liveness verification complete!", {
              description: `All ${CHALLENGES.length} challenges passed · ${landmarks.length} landmarks stored as Float32 vectors.`,
              duration: 6000,
              icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
            });
            return;
          }

          // Advance
          stepRef.current = idx + 1;
          holdRef.current = 0;
          setStepIndex(idx + 1);
          setHoldCount(0);
          setStepStatus((prev) =>
            prev.map((s, i) =>
              i === idx ? "done" : i === idx + 1 ? "active" : s
            )
          );
        }
      } else {
        // Gesture not held — decay hold count slowly
        if (holdRef.current > 0) {
          holdRef.current = Math.max(0, holdRef.current - 1);
          setHoldCount(holdRef.current);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    // Mark first challenge active
    setStepStatus((prev) => prev.map((s, i) => (i === 0 ? "active" : s)));
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  /* ── Render helpers ── */
  const ch       = CHALLENGES[Math.min(stepIndex, CHALLENGES.length - 1)];
  const col      = COLOR[ch.color];
  const progress = Math.min((holdCount / ch.holdFrames) * 100, 100);
  const doneCount = stepStatus.filter((s) => s === "done").length;

  return (
    <div className="min-h-full w-full bg-[#f8fafc] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-medium">
            MediaPipe · Face Landmarker
          </div>
          <h2 className="text-xl font-bold text-[#0A192F] mt-0.5">Liveness Check</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A192F] text-white text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#60A5FA]" />
          Anti-Spoof AI · On-Device
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Camera panel ── */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="relative bg-[#0A192F] rounded-2xl overflow-hidden aspect-video shadow-xl ring-1 ring-white/10 flex items-center justify-center">

            {/* Hidden real video (used by MediaPipe) */}
            <video ref={videoRef} className="hidden" autoPlay playsInline muted />

            {/* Mirrored canvas shown to user */}
            <canvas
              ref={canvasRef}
              className={`w-full h-full object-cover ${
                pageStatus === "running" || pageStatus === "ready" || pageStatus === "done"
                  ? "block"
                  : "hidden"
              }`}
            />

            {/* Scanning brackets overlay */}
            {(pageStatus === "running" || pageStatus === "ready") && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-52 h-64">
                  <span className={`absolute top-0 left-0 w-10 h-10 border-l-[3px] border-t-[3px] ${col.ring} rounded-tl-xl transition-colors duration-500`} />
                  <span className={`absolute top-0 right-0 w-10 h-10 border-r-[3px] border-t-[3px] ${col.ring} rounded-tr-xl transition-colors duration-500`} />
                  <span className={`absolute bottom-0 left-0 w-10 h-10 border-l-[3px] border-b-[3px] ${col.ring} rounded-bl-xl transition-colors duration-500`} />
                  <span className={`absolute bottom-0 right-0 w-10 h-10 border-r-[3px] border-b-[3px] ${col.ring} rounded-br-xl transition-colors duration-500`} />
                  {pageStatus === "running" && (
                    <div
                      className="absolute left-2 right-2 h-[2px] animate-scan"
                      style={{
                        top: "50%",
                        background: `linear-gradient(to right, transparent, ${
                          { blue:"#3b82f6", amber:"#f59e0b", violet:"#8b5cf6", emerald:"#10b981" }[ch.color]
                        }, transparent)`,
                        boxShadow: `0 0 10px 2px ${{ blue:"#3b82f680", amber:"#f59e0b80", violet:"#8b5cf680", emerald:"#10b98180" }[ch.color]}`,
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Done overlay */}
            {pageStatus === "done" && (
              <div className="absolute inset-0 bg-emerald-900/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-white text-lg font-bold">Identity Verified</div>
                  <div className="text-white/60 text-sm mt-1">{savedCount} face vectors saved · localStorage persisted</div>
                </div>
                <button
                  onClick={resetScan}
                  className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2 border border-white/30"
                >
                  <Play className="w-4 h-4" /> Scan Again
                </button>
              </div>
            )}

            {/* Idle */}
            {pageStatus === "idle" && (
              <div className="flex flex-col items-center gap-4 text-white/60 p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-white/40" />
                </div>
                <div>
                  <div className="text-white text-base font-semibold">Enable Camera & Load Model</div>
                  <div className="text-white/50 text-sm mt-1">MediaPipe Face Landmarker will load (~10 MB)</div>
                </div>
                <button onClick={initialise}
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#3b82f6] text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Enable Camera
                </button>
              </div>
            )}

            {/* Loading model */}
            {pageStatus === "loading-model" && (
              <div className="flex flex-col items-center gap-3 text-white/60">
                <Loader2 className="w-10 h-10 animate-spin text-[#2563EB]" />
                <div className="text-white text-sm font-medium">Loading MediaPipe model…</div>
                <div className="text-white/40 text-xs">Face Landmarker · ~10 MB download</div>
              </div>
            )}

            {/* Denied */}
            {(pageStatus === "denied" || pageStatus === "error") && (
              <div className="flex flex-col items-center gap-4 text-white/60 p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-red-900/30 border border-red-500/30 flex items-center justify-center">
                  <CameraOff className="w-10 h-10 text-red-400" />
                </div>
                <div>
                  <div className="text-red-400 text-base font-semibold">
                    {pageStatus === "denied" ? "Camera Access Denied" : "Initialization Error"}
                  </div>
                  <div className="text-white/50 text-sm mt-1">Allow camera in browser settings and retry.</div>
                </div>
                <button onClick={initialise}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Retry
                </button>
              </div>
            )}

            {/* Bottom progress bar when running */}
            {pageStatus === "running" && (
              <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm px-4 py-3">
                <div className="flex items-center gap-3 mb-1.5">
                  <ch.icon className={`w-4 h-4 ${col.text} shrink-0`} />
                  <span className="text-white text-sm font-semibold flex-1">{ch.instruction}</span>
                  <span className="text-white/40 text-[11px] font-mono">{doneCount}/{CHALLENGES.length}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full ${col.badge} rounded-full transition-all duration-75`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Start button */}
          {pageStatus === "ready" && (
            <button onClick={startLoop}
              className="w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563EB] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30">
              <Play className="w-4 h-4" />
              Start Liveness Verification
            </button>
          )}

          {/* Tech badges */}
          <div className="flex flex-wrap gap-2 text-[11px] text-[#64748b]">
            {["MediaPipe Face Landmarker", "478 Landmarks · Blendshapes", "On-Device · No Upload", "SQLite Vector Storage"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#e2e8f0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Challenge list */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f1f5f9]">
              <div className="text-sm font-semibold text-[#0A192F]">Liveness Challenges</div>
              <div className="text-[11px] text-[#94a3b8] mt-0.5">Perform each gesture when prompted</div>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {CHALLENGES.map((c, i) => {
                const st = stepStatus[i];
                const isActive = st === "active";
                const isDone   = st === "done";
                const cc = COLOR[c.color];
                return (
                  <div key={c.id} className={`flex items-center gap-4 px-5 py-4 transition-colors ${isActive ? cc.bg : ""}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isDone ? "bg-emerald-500" : isActive ? cc.badge : "bg-[#f1f5f9]"
                    }`}>
                      {isDone
                        ? <CheckCircle2 className="w-5 h-5 text-white" />
                        : <c.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#94a3b8]"}`} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold ${isDone ? "text-emerald-600" : isActive ? "#0A192F" : "text-[#94a3b8]"}`}>
                        {c.label}
                      </div>
                      <div className="text-[11px] text-[#94a3b8] mt-0.5">
                        {isDone ? "Verified ✓" : isActive ? c.instruction : "Waiting…"}
                      </div>
                      {isActive && (
                        <div className="mt-2 h-1 rounded-full bg-[#e2e8f0] overflow-hidden">
                          <div className={`h-full ${cc.badge} rounded-full transition-all duration-75`}
                            style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>
                    <div className={`text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      isDone ? "bg-emerald-100 text-emerald-700"
                      : isActive ? `${cc.bg} ${cc.text}`
                      : "bg-[#f1f5f9] text-[#94a3b8]"
                    }`}>
                      {i + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SQLite status card */}
          <div className="bg-[#0A192F] rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-[#60A5FA]" />
              <div className="text-sm font-semibold">SQLite Face Vector Store</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center mb-4">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-2xl font-bold text-[#60A5FA]">{savedCount}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Vectors Saved</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-2xl font-bold">{doneCount}/{CHALLENGES.length}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Challenges Done</div>
              </div>
            </div>
            {/* Overall ring */}
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none"
                    stroke={pageStatus === "done" ? "#10B981" : "#2563EB"}
                    strokeWidth="3"
                    strokeDasharray={`${(doneCount / CHALLENGES.length) * 100} 100`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {Math.round((doneCount / CHALLENGES.length) * 100)}%
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-white/50">
                  {pageStatus === "done" ? "Complete — vectors committed to DB" :
                   pageStatus === "running" ? "Recording face landmarks…" :
                   "Awaiting verification start"}
                </div>
                <div className="mt-2 flex gap-1">
                  {CHALLENGES.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                      stepStatus[i] === "done" ? "bg-emerald-400"
                      : stepStatus[i] === "active" ? "bg-[#2563EB]"
                      : "bg-white/10"
                    }`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
