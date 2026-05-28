import { ShieldCheck, Lock, Eye, AlertTriangle, Cpu, Fingerprint } from "lucide-react";

export function SecurityScreen() {
  return (
    <div className="h-full w-full bg-background pb-6">
      <div className="bg-navy-radial text-white px-5 pt-4 pb-8 rounded-b-3xl relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Defense Posture</div>
          <h1 className="text-xl font-semibold mt-0.5">Security Center</h1>

          <div className="mt-5 flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#10B981" strokeWidth="2.5"
                  strokeDasharray="94 100" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-bold">94</span>
                <span className="text-[9px] text-white/60 uppercase">Score</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Excellent posture</div>
              <div className="text-[11px] text-white/60 mt-0.5">All critical defenses active. Last audit 4h ago.</div>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-success">
                <ShieldCheck className="w-3 h-3" /> Zero active threats
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 grid grid-cols-2 gap-3">
        {[
          { i: Eye, l: "Spoof Protection", v: "Active", ok: true },
          { i: Lock, l: "Encryption", v: "AES-256", ok: true },
          { i: Cpu, l: "Edge Model", v: "v2.4.1", ok: true },
          { i: Fingerprint, l: "Device Trust", v: "Bound", ok: true },
        ].map((c) => (
          <div key={c.l} className="bg-card border border-border rounded-2xl p-3.5 shadow-soft">
            <div className="flex items-center justify-between">
              <c.i className="w-4 h-4 text-accent-blue" />
              <span className="w-2 h-2 rounded-full bg-success" />
            </div>
            <div className="mt-2 text-xs font-semibold">{c.l}</div>
            <div className="text-[10px] text-muted-foreground">{c.v}</div>
          </div>
        ))}
      </div>

      <div className="px-5 mt-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Threat Monitor</div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">Last 24 hours</div>
            <span className="text-[10px] text-success">0 incidents</span>
          </div>
          <div className="flex items-end gap-1 h-16">
            {[10, 12, 8, 14, 9, 11, 7, 13, 10, 15, 9, 12, 8, 11, 10, 13, 9, 14, 11, 8, 10, 12, 9, 11].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-accent-blue/30" style={{ height: `${h * 4}%` }} />
            ))}
          </div>
          <div className="flex justify-between text-[9px] text-muted-foreground mt-2">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="bg-alert/5 border border-alert/20 rounded-2xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-alert/15 text-alert flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold">Soft advisory</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Model update available. Apply during next sync window for improved spoof resistance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
