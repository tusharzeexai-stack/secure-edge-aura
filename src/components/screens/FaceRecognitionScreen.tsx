import { ScanFace, CheckCircle2, Sparkles, X } from "lucide-react";

export function FaceRecognitionScreen() {
  return (
    <div className="relative h-full w-full bg-navy-deep overflow-hidden">
      {/* "Camera" backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-rich via-navy-deep to-black" />
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute inset-x-0 top-1/4 h-1/2 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.18),transparent_70%)]" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-4 text-white">
        <button className="w-9 h-9 rounded-full glass-card flex items-center justify-center">
          <X className="w-4 h-4" />
        </button>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">AI Authentication</div>
          <div className="text-sm font-semibold">Face Recognition</div>
        </div>
        <div className="w-9 h-9" />
      </div>

      {/* Scan frame */}
      <div className="relative z-10 mt-8 flex justify-center">
        <div className="relative w-60 h-72">
          {/* Face silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ScanFace className="w-40 h-40 text-white/30" strokeWidth={0.8} />
          </div>
          {/* Brackets */}
          <span className="absolute top-0 left-0 w-10 h-10 border-l-[3px] border-t-[3px] border-accent-blue rounded-tl-2xl" />
          <span className="absolute top-0 right-0 w-10 h-10 border-r-[3px] border-t-[3px] border-accent-blue rounded-tr-2xl" />
          <span className="absolute bottom-0 left-0 w-10 h-10 border-l-[3px] border-b-[3px] border-accent-blue rounded-bl-2xl" />
          <span className="absolute bottom-0 right-0 w-10 h-10 border-r-[3px] border-b-[3px] border-accent-blue rounded-br-2xl" />
          {/* Scan line */}
          <div className="absolute left-2 right-2 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-accent-blue to-transparent shadow-[0_0_16px_#2563EB] animate-scan" />
          {/* Landmark dots */}
          {[
            [40, 40], [55, 40], [47, 55], [40, 70], [55, 70], [47, 80],
          ].map(([l, t], i) => (
            <span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_8px_#2563EB]"
              style={{ left: `${l}%`, top: `${t}%` }}
            />
          ))}
        </div>
      </div>

      {/* Confidence ring */}
      <div className="relative z-10 mt-6 flex flex-col items-center">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="#10B981" strokeWidth="3"
              strokeDasharray="94 100" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-lg font-bold">94%</span>
            <span className="text-[8px] text-white/50 uppercase">Match</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 border border-success/40">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
          <span className="text-[11px] text-success font-medium">Identity verified</span>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 inset-x-5 z-10">
        <div className="glass-card rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent-blue" />
            <span className="text-xs font-semibold tracking-wide">AI Edge Inference · 38ms</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { l: "Liveness", v: "PASS" },
              { l: "Depth", v: "3D" },
              { l: "Spoof", v: "CLEAR" },
            ].map((m) => (
              <div key={m.l}>
                <div className="text-[9px] text-white/50 uppercase tracking-wider">{m.l}</div>
                <div className="text-xs font-bold text-success mt-0.5">{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
