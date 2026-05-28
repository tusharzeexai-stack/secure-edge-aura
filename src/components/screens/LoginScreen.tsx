import { Fingerprint, ScanFace, Shield, WifiOff, ChevronRight, Lock } from "lucide-react";

export function LoginScreen() {
  return (
    <div className="relative h-full w-full bg-navy-radial">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative h-full flex flex-col p-6 pt-12">
        {/* Top bar */}
        <div className="flex items-center justify-between text-white/80">
          <div className="flex items-center gap-2 text-[11px]">
            <Shield className="w-3.5 h-3.5 text-accent-blue" />
            <span className="tracking-wider">SENTINEL AI</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full glass-card text-[10px]">
            <WifiOff className="w-3 h-3 text-success" />
            <span>OFFLINE MODE</span>
          </div>
        </div>

        {/* Hero scanner illustration */}
        <div className="mt-8 flex justify-center">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 rounded-full bg-accent-blue/10 blur-2xl" />
            <div className="relative w-full h-full rounded-3xl glass-card flex items-center justify-center">
              <ScanFace className="w-16 h-16 text-white" strokeWidth={1.2} />
              <div className="absolute inset-3 rounded-2xl border border-accent-blue/40" />
              <div className="absolute left-3 right-3 top-1/2 h-[1.5px] bg-gradient-to-r from-transparent via-accent-blue to-transparent animate-scan" />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-white text-2xl font-semibold">Welcome back</h1>
          <p className="text-white/60 text-sm mt-1">Authenticate to access the field console</p>
        </div>

        {/* Glass card */}
        <div className="mt-6 glass-white rounded-3xl p-5 shadow-card">
          <button className="w-full bg-navy-deep text-white rounded-2xl py-3.5 px-4 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-blue/20 flex items-center justify-center">
                <ScanFace className="w-5 h-5 text-accent-blue" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Face Authentication</div>
                <div className="text-[10px] text-white/60">AI · Liveness verified</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/60" />
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button className="w-full bg-muted text-foreground rounded-2xl py-3 px-4 flex items-center justify-between hover:bg-secondary transition">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-accent-blue" />
              <span className="text-sm font-medium">Secure PIN fallback</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="mt-4 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-success">
              <Fingerprint className="w-3.5 h-3.5" />
              <span className="font-medium">Trusted Device</span>
            </div>
            <span className="text-muted-foreground">ID · A7B-92F1</span>
          </div>
        </div>

        <div className="mt-auto text-center text-[10px] text-white/40 tracking-wider">
          AES-256 ENCRYPTED · ZERO NETWORK REQUIRED
        </div>
      </div>
    </div>
  );
}
