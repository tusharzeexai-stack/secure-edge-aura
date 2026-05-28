import { Cloud, CheckCircle2, Trash2, Wifi, Server } from "lucide-react";

export function SyncScreen() {
  return (
    <div className="relative h-full w-full bg-navy-radial text-white">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative h-full flex flex-col p-5 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Cloud Sync</div>
            <h2 className="text-lg font-semibold">AWS Secure Upload</h2>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/20 text-success text-[10px]">
            <Wifi className="w-3 h-3" />
            <span>Connected · 5G</span>
          </div>
        </div>

        {/* Progress ring */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="url(#sg)" strokeWidth="2.5"
                strokeDasharray="72 100" strokeLinecap="round" />
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Cloud className="w-8 h-8 text-accent-blue mb-1" />
              <div className="text-3xl font-display font-bold">72%</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Uploading</div>
            </div>
            {/* Orbiting nodes */}
            <span className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_10px_#2563EB]" />
            <span className="absolute bottom-6 right-3 w-1.5 h-1.5 rounded-full bg-success" />
            <span className="absolute bottom-6 left-3 w-1.5 h-1.5 rounded-full bg-white/60" />
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-sm font-semibold">Syncing 42 encrypted records</div>
          <div className="text-xs text-white/60 mt-0.5">30 of 42 uploaded · 18.2 MB / 25.4 MB</div>
        </div>

        {/* Node list */}
        <div className="mt-5 glass-white text-foreground rounded-3xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AWS Endpoint</div>
            <span className="text-[10px] text-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Verified</span>
          </div>
          <div className="space-y-2.5">
            {[
              { l: "ap-south-1 · Mumbai", v: "Primary", ok: true },
              { l: "S3 · sentinel-vault", v: "Bucket", ok: true },
              { l: "KMS · CMK-A41F", v: "Encrypted", ok: true },
            ].map((n) => (
              <div key={n.l} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Server className="w-4 h-4 text-accent-blue" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold">{n.l}</div>
                  <div className="text-[10px] text-muted-foreground">{n.v}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
            ))}
          </div>
        </div>

        <button className="mt-4 w-full glass-card text-white rounded-2xl py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/10 transition">
          <Trash2 className="w-4 h-4" />
          Purge local after sync
        </button>

        <div className="mt-auto text-center text-[10px] text-white/40 tracking-wider">
          TLS 1.3 · SIGV4 · 256-BIT
        </div>
      </div>
    </div>
  );
}
