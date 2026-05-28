import { TrendingUp, Users, ShieldAlert, Smartphone } from "lucide-react";

export function AdminScreen() {
  const heat = Array.from({ length: 7 * 12 }).map((_, i) => {
    const v = (Math.sin(i * 1.3) + Math.cos(i * 0.7) + 2) / 4;
    return v;
  });

  return (
    <div className="h-full w-full bg-background pb-6">
      <div className="bg-navy-deep text-white px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Command Console</div>
            <h1 className="text-xl font-semibold mt-0.5">Admin Analytics</h1>
          </div>
          <div className="text-[10px] px-2.5 py-1 rounded-full glass-card">Live · 14:02</div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { i: Users, l: "Active", v: "1,284" },
            { i: TrendingUp, l: "Verifies", v: "8.4k" },
            { i: ShieldAlert, l: "Flags", v: "12" },
            { i: Smartphone, l: "Devices", v: "342" },
          ].map((s) => (
            <div key={s.l} className="glass-card rounded-xl p-2.5">
              <s.i className="w-3.5 h-3.5 text-accent-blue mb-1" />
              <div className="text-sm font-bold">{s.v}</div>
              <div className="text-[9px] text-white/50 uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="px-5 mt-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold">Attendance Heatmap</div>
              <div className="text-[10px] text-muted-foreground">Past 12 weeks</div>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <span>Less</span>
              <span className="w-2 h-2 rounded-sm bg-accent-blue/10" />
              <span className="w-2 h-2 rounded-sm bg-accent-blue/30" />
              <span className="w-2 h-2 rounded-sm bg-accent-blue/60" />
              <span className="w-2 h-2 rounded-sm bg-accent-blue" />
              <span>More</span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-1">
            {heat.map((v, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm"
                style={{ backgroundColor: `rgba(37,99,235,${0.08 + v * 0.85})` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fraud chart */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-2xl p-3.5 shadow-soft">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Fraud Attempts</div>
          <div className="text-lg font-bold mt-1">0.42%</div>
          <svg viewBox="0 0 100 30" className="w-full h-8 mt-1">
            <path d="M0,20 L15,18 L30,22 L45,12 L60,15 L75,8 L100,11" stroke="#EF4444" strokeWidth="1.5" fill="none" />
          </svg>
          <div className="text-[10px] text-success">▼ 18% vs last week</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-3.5 shadow-soft">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg Confidence</div>
          <div className="text-lg font-bold mt-1">93.6%</div>
          <svg viewBox="0 0 100 30" className="w-full h-8 mt-1">
            <path d="M0,22 L20,15 L40,18 L60,9 L80,12 L100,6" stroke="#10B981" strokeWidth="1.5" fill="none" />
          </svg>
          <div className="text-[10px] text-success">▲ 2.1 pts</div>
        </div>
      </div>

      {/* Field staff */}
      <div className="px-5 mt-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Top Field Staff</div>
        <div className="bg-card border border-border rounded-2xl p-2 shadow-soft">
          {[
            { n: "Aarav Reddy", r: "Sector 14", v: 318 },
            { n: "Meera Joshi", r: "Sector 09", v: 296 },
            { n: "Dev Kapoor", r: "Sector 12", v: 271 },
          ].map((s, i) => (
            <div key={s.n} className={`flex items-center gap-3 p-2.5 ${i !== 2 ? "border-b border-border" : ""}`}>
              <div className="w-7 h-7 rounded-full bg-accent-blue/15 text-accent-blue text-[10px] font-bold flex items-center justify-center">
                #{i + 1}
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold">{s.n}</div>
                <div className="text-[10px] text-muted-foreground">{s.r}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold">{s.v}</div>
                <div className="text-[9px] text-muted-foreground">verifies</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
