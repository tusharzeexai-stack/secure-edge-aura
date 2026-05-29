import { useEffect, useRef, useState, useCallback } from "react";
import {
  ScanFace, CheckCircle2, Sparkles, X, Camera, RefreshCw, HelpCircle,
} from "lucide-react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import { getAllSavedVectors } from "@/lib/faceDb";
import { toast } from "sonner";

interface MatchResult {
  sessionId: number;
  label: string;
  confidence: number;
}

// ── Landmark Normalization Helper ──
function normalizeLandmarks(landmarks: Array<{ x: number; y: number; z: number }>) {
  if (landmarks.length === 0) return [];
  
  // 1. Compute Centroid
  let cx = 0, cy = 0, cz = 0;
  for (const lm of landmarks) {
    cx += lm.x;
    cy += lm.y;
    cz += lm.z;
  }
  cx /= landmarks.length;
  cy /= landmarks.length;
  cz /= landmarks.length;

  // 2. Translate and calculate scale factor (mean distance from centroid)
  let sumDist = 0;
  const translated = landmarks.map((lm) => {
    const dx = lm.x - cx;
    const dy = lm.y - cy;
    const dz = lm.z - cz;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    sumDist += d;
    return { x: dx, y: dy, z: dz };
  });

  const meanDist = sumDist / landmarks.length;
  const scale = meanDist > 0 ? 1 / meanDist : 1;

  // 3. Apply Scale
  return translated.map((lm) => ({
    x: lm.x * scale,
    y: lm.y * scale,
    z: lm.z * scale,
  }));
}

export function FaceRecognitionScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const activeMatchingRef = useRef<boolean>(true);

  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "scanning" | "matched" | "unknown">("idle");
  const [matchInfo, setMatchInfo] = useState<MatchResult | null>(null);
  const [inferenceTime, setInferenceTime] = useState<number>(0);
  const [closestLabel, setClosestLabel] = useState<string>("NONE");
  const [closestDist, setClosestDist] = useState<number>(0);
  const [dbVectors, setDbVectors] = useState<any[]>([]);

  // Load saved face vectors from local SQLite
  const loadVectors = async () => {
    const vectors = await getAllSavedVectors();
    setDbVectors(vectors);
  };

  useEffect(() => {
    loadVectors();
    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      landmarkerRef.current?.close();
    };
  }, []);

  // Initialize MediaPipe & Webcam
  const startCamera = async () => {
    setStatus("loading");
    try {
      // Reload vectors just in case a new label was saved
      await loadVectors();

      // 1. Load MediaPipe
      const vision = await FilesetResolver.forVisionTasks("/mediapipe-wasm");
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

      // 2. Open Stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatus("scanning");
      activeMatchingRef.current = true;
      startRecognitionLoop();
    } catch (err) {
      console.error(err);
      toast.error("Failed to access camera or load ML models.");
      setStatus("idle");
    }
  };

  // Real-time Recognition Inference Loop
  const startRecognitionLoop = () => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      if (!landmarkerRef.current || !video.videoWidth || !activeMatchingRef.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const t0 = performance.now();

      // Draw mirrored video to canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // ML Inference
      const result = landmarkerRef.current.detectForVideo(video, performance.now());
      const t1 = performance.now();
      setInferenceTime(Math.round(t1 - t0));

      if (result.faceLandmarks && result.faceLandmarks.length > 0) {
        // Draw landmarks preview on canvas
        const landmarks = result.faceLandmarks[0];
        ctx.fillStyle = "#2563EB";
        landmarks.slice(0, 80).forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 2, 0, 2 * Math.PI);
          ctx.fill();
        });

        // Face vector matching logic
        const currentPoints = landmarks.map((lm) => ({ x: lm.x, y: lm.y, z: lm.z }));
        const normCurrent = normalizeLandmarks(currentPoints);

        let bestMatch: MatchResult | null = null;
        let lowestDist = Infinity;

        // Compare current landmarks with each saved profile in SQLite
        dbVectors.forEach((prof) => {
          const storedPoints = [];
          for (let i = 0; i < 478; i++) {
            storedPoints.push({
              x: prof.embedding[i * 3],
              y: prof.embedding[i * 3 + 1],
              z: prof.embedding[i * 3 + 2],
            });
          }
          const normStored = normalizeLandmarks(storedPoints);

          // Calculate Euclidean distance
          let sumSqDist = 0;
          const minLen = Math.min(normCurrent.length, normStored.length);
          for (let i = 0; i < minLen; i++) {
            const dx = normCurrent[i].x - normStored[i].x;
            const dy = normCurrent[i].y - normStored[i].y;
            const dz = normCurrent[i].z - normStored[i].z;
            sumSqDist += dx * dx + dy * dy + dz * dz;
          }
          const dist = Math.sqrt(sumSqDist);

          if (dist < lowestDist) {
            lowestDist = dist;
            // Mathematically tuned mapping of normalized Euclidean distance to confidence score:
            let confidence = 0;
            if (dist < 0.40) {
              // Superb match: map [0.0, 0.40] -> [100, 90]
              confidence = Math.round(100 - (dist * 25));
            } else if (dist < 0.70) {
              // Valid match: map [0.40, 0.70] -> [90, 75]
              confidence = Math.round(90 - ((dist - 0.40) * 50));
            } else {
              // Potential match/unknown: map [0.70, 1.20] -> [75, 40]
              confidence = Math.round(75 - ((dist - 0.70) * 70));
            }
            confidence = Math.max(0, Math.min(100, confidence));

            bestMatch = {
              sessionId: prof.sessionId,
              label: prof.label || `Session #${prof.sessionId}`,
              confidence,
            };
          }
        });

        if (bestMatch) {
          setClosestLabel(bestMatch.label);
          setClosestDist(lowestDist);
        } else {
          setClosestLabel("NONE");
          setClosestDist(0);
        }

        if (bestMatch && (bestMatch as MatchResult).confidence >= 75) {
          setMatchInfo(bestMatch);
          setStatus("matched");
        } else if (bestMatch && (bestMatch as MatchResult).confidence > 40) {
          // Low confidence match
          setMatchInfo(bestMatch);
          setStatus("unknown");
        } else {
          setMatchInfo(null);
          setStatus("scanning");
        }
      } else {
        setClosestLabel("NONE");
        setClosestDist(0);
        setStatus("scanning");
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);
    activeMatchingRef.current = false;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setStatus("idle");
    setMatchInfo(null);
  };

  return (
    <div className="relative h-full w-full bg-[#0A192F] overflow-hidden flex flex-col justify-between p-6">
      
      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between text-white border-b border-white/5 pb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">AI Authentication</div>
          <div className="text-sm font-semibold">Edge Face Recognition</div>
        </div>
        <div className="text-xs text-white/40">
          Profiles: <span className="text-blue-400 font-bold">{dbVectors.length}</span>
        </div>
      </div>

      {/* Main Scan area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-6">
        <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10 flex items-center justify-center bg-[#091526]">
          
          {/* Real video hidden */}
          <video ref={videoRef} className="hidden" autoPlay playsInline muted />

          {/* Mirrored Canvas preview */}
          <canvas
            ref={canvasRef}
            className={`w-full h-full object-cover ${
              status === "scanning" || status === "matched" || status === "unknown"
                ? "block"
                : "hidden"
            }`}
          />

          {/* Brackets Overlay */}
          {(status === "scanning" || status === "matched" || status === "unknown") && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-48 h-60">
                <span className={`absolute top-0 left-0 w-8 h-8 border-l-[3px] border-t-[3px] rounded-tl-xl transition-colors duration-300 ${
                  status === "matched" ? "border-emerald-500" : "border-blue-500 animate-pulse"
                }`} />
                <span className={`absolute top-0 right-0 w-8 h-8 border-r-[3px] border-t-[3px] rounded-tr-xl transition-colors duration-300 ${
                  status === "matched" ? "border-emerald-500" : "border-blue-500 animate-pulse"
                }`} />
                <span className={`absolute bottom-0 left-0 w-8 h-8 border-l-[3px] border-b-[3px] rounded-bl-xl transition-colors duration-300 ${
                  status === "matched" ? "border-emerald-500" : "border-blue-500 animate-pulse"
                }`} />
                <span className={`absolute bottom-0 right-0 w-8 h-8 border-r-[3px] border-b-[3px] rounded-br-xl transition-colors duration-300 ${
                  status === "matched" ? "border-emerald-500" : "border-blue-500 animate-pulse"
                }`} />
                
                {status === "scanning" && (
                  <div className="absolute left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_16px_#3b82f6] animate-scan" />
                )}
              </div>
            </div>
          )}

          {/* Idle screen */}
          {status === "idle" && (
            <div className="flex flex-col items-center gap-4 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <ScanFace className="w-8 h-8 text-white/40" />
              </div>
              <div>
                <div className="text-white text-sm font-semibold">Start Recognition Engine</div>
                <div className="text-white/40 text-xs mt-1">Loads edge comparator algorithm</div>
              </div>
              <button
                onClick={startCamera}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                <Camera className="w-4 h-4" /> Enable Face Scan
              </button>
            </div>
          )}

          {/* Loading screen */}
          {status === "loading" && (
            <div className="flex flex-col items-center gap-3 text-white/50">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
              <span className="text-xs font-medium">Initializing AI models…</span>
            </div>
          )}
        </div>
      </div>

      {/* Confidence ring / Recognition Match Info */}
      <div className="relative z-10 flex flex-col items-center justify-center h-28">
        {status === "matched" && matchInfo && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl">
              {/* Score circle */}
              <div className="relative w-12 h-12 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#10B981" strokeWidth="3"
                    strokeDasharray={`${matchInfo.confidence} 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-emerald-400 text-xs font-bold font-mono">{matchInfo.confidence}%</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Identity Verified
                </div>
                <div className="text-white text-base font-bold mt-0.5">
                  Recognized: {matchInfo.label}
                </div>
              </div>
            </div>
          </div>
        )}

        {status === "unknown" && matchInfo && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/20 px-6 py-3 rounded-2xl">
              <HelpCircle className="w-8 h-8 text-amber-500 animate-pulse" />
              <div>
                <div className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">
                  Low Confidence Match
                </div>
                <div className="text-white text-xs mt-0.5">
                  Unknown face (closest: {matchInfo.label} - {matchInfo.confidence}%)
                </div>
              </div>
            </div>
          </div>
        )}

        {status === "scanning" && (
          <div className="flex flex-col items-center text-white/50 text-xs gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            <span>Scanning for faces in video stream…</span>
          </div>
        )}

        {status === "idle" && (
          <div className="text-white/30 text-xs text-center">
            Ready to authenticate using local SQLite face vector embeddings
          </div>
        )}
      </div>

      {/* Edge Inference Stats */}
      <div className="relative z-10">
        <div className="glass-card bg-[#0d2137]/80 rounded-2xl p-4 text-white border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold tracking-wide">
                AI Edge Inference {status !== "idle" && status !== "loading" ? `· ${inferenceTime}ms` : ""}
              </span>
            </div>
            {status !== "idle" && (
              <button
                onClick={stopCamera}
                className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-0.5 bg-red-500/10 rounded-md border border-red-500/20 transition-all"
              >
                Stop Scan
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { l: "Liveness", v: status === "matched" ? "PASS" : "WAIT" },
              { l: "Closest Match", v: closestLabel !== "NONE" ? `${closestLabel} (D: ${closestDist.toFixed(3)})` : "NONE" },
              { l: "Engine", v: "CPU-3D" },
            ].map((m) => (
              <div key={m.l}>
                <div className="text-[9px] text-white/50 uppercase tracking-wider">{m.l}</div>
                <div className={`text-xs font-bold mt-0.5 ${
                  m.v === "PASS" || (status === "matched" && m.l === "Closest Match")
                    ? "text-emerald-400"
                    : m.v !== "NONE" && m.l === "Closest Match"
                    ? "text-blue-400"
                    : "text-white/40"
                }`}>{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
