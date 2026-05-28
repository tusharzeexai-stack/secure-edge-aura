import { Database, Lock, HardDrive, ChevronRight, CheckCircle2, Clock } from "lucide-react";

export function OfflineStorageScreen() {
  const logs = [
    { id: "TX-9821", name: "Priya Sharma", time: "09:42", status: "queued" },
    { id: "TX-9820", name: "Rohan Mehta", time: "09:38", status: "queued" },
    { id: "TX-9819", name: "Anita Iyer", time: "09:31", status: "synced" },
    { id: "TX-9818", name: "Karan Patel", time: "09:24", status: "queued" },
  ];

  return (
    <div className="h-full w-full bg-background">
      <div className="bg-navy-deep text-white px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Encrypted Vault</div>
        <h1 className="text-xl font-semibold mt-1">Offline Storage</h1>

        <div className="mt-4 glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-success" />
              <span className="text-xs font-medium">AES-256 · Sealed</span>
            </div>
            <span className="text-[10px] text-white/50">Vault healthy</span>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-2xl font-display font-bold">2.4 GB</div>
              <div className="text-[10px] text-white/50">of 8 GB used</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-accent-blue">312</div>
              <div className="text-[10px] text-white/50">records</div>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-[30%] bg-gradient-to-r from-accent-blue to-success rounded-full" />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 grid grid-cols-3 gap-2">
        {[
          { i: Database, l: "Total", v: "312" },
          { i: Clock, l: "Queued", v: "42" },
          { i: CheckCircle2, l: "Synced", v: "270" },
        ].map((s) => (
          <div key={s.l} className="bg-card border border-border rounded-2xl p-3 shadow-soft">
            <s.i className="w-4 h-4 text-accent-blue mb-1.5" />
            <div className="text-base font-bold text-navy-deep">{s.v}</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Storage chart */}
      <div className="px-5 mt-5">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">Storage analytics</div>
            <HardDrive className="w-4 h-4 text-muted-foreground" />
          </div>
          <svg viewBox="0 0 200 60" className="w-full h-16">
            <defs>
              <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,45 C20,40 40,30 60,32 S100,15 120,22 160,10 200,18 L200,60 L0,60 Z" fill="url(#ga)" />
            <path d="M0,45 C20,40 40,30 60,32 S100,15 120,22 160,10 200,18" stroke="#2563EB" strokeWidth="1.5" fill="none" />
          </svg>
          <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>

      {/* Pending queue */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Sync</div>
          <span className="text-[10px] text-accent-blue">View all</span>
        </div>
        <div className="space-y-2">
          {logs.map((l) => (
            <div key={l.id} className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3 shadow-soft">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <Lock className="w-4 h-4 text-accent-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{l.name}</div>
                <div className="text-[10px] text-muted-foreground">{l.id} · {l.time}</div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                l.status === "synced" ? "bg-success/15 text-success" : "bg-accent-blue/15 text-accent-blue"
              }`}>
                {l.status}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
