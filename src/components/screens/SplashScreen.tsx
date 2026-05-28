import { ShieldCheck, ScanFace } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="relative h-full w-full bg-navy-radial overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 grid-bg opacity-40" />
      {/* Glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-accent-blue/20 blur-3xl" />

      {/* Face scan ring */}
      <div className="relative mb-10">
        <div className="absolute inset-0 rounded-full border border-accent-blue/30 animate-[spin-slow_8s_linear_infinite]" style={{ width: 180, height: 180 }} />
        <div className="absolute inset-0 rounded-full border border-white/10" style={{ width: 180, height: 180 }} />
        <div className="relative w-[180px] h-[180px] rounded-full border-2 border-accent-blue/60 flex items-center justify-center overflow-hidden glass-card">
          <ScanFace className="w-20 h-20 text-white" strokeWidth={1.2} />
          {/* Scanning line */}
          <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-accent-blue to-transparent shadow-[0_0_12px_#2563EB] animate-scan" />
          {/* corner brackets */}
          <span className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-accent-blue" />
          <span className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-accent-blue" />
          <span className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-accent-blue" />
          <span className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-accent-blue" />
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2 mb-2">
        <ShieldCheck className="w-5 h-5 text-accent-blue" />
        <span className="text-white font-display text-xl font-semibold tracking-tight">
          SENTINEL <span className="text-gradient-blue">AI</span>
        </span>
      </div>
      <div className="relative z-10 text-[11px] uppercase tracking-[0.25em] text-white/60">
        Offline Secure Authentication
      </div>

      <div className="absolute bottom-20 flex flex-col items-center gap-3">
        <div className="w-40 h-[3px] rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-accent-blue to-white/80 rounded-full animate-[shimmer_2s_linear_infinite]"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
        <div className="text-[10px] text-white/40 tracking-widest">INITIALIZING SECURE MODULES</div>
      </div>

      <div className="absolute bottom-6 text-[10px] text-white/30 tracking-widest">
        v2.4.1 · EDGE BUILD
      </div>
    </div>
  );
}
