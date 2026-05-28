import { ScanFace, CloudUpload, History, Shield, TrendingUp, WifiOff, Bell, ChevronRight, Activity } from "lucide-react";

export function DashboardScreen() {
  return (
    <div className="h-full w-full bg-background pb-20">
      {/* Header */}
      <div className="bg-navy-radial text-white px-5 pt-4 pb-8 rounded-b-[32px] relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-blue-700 flex items-center justify-center text-sm font-bold">
              AR
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/50">Field Officer</div>
              <div className="text-sm font-semibold">Aarav Reddy</div>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full glass-card flex items-center justify-center relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-alert rounded-full" />
          </div>
        </div>

        <div className="relative mt-5 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-card text-[10px]">
            <WifiOff className="w-3 h-3 text-success" />
            <span>Offline · Last sync 2h ago</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/20 text-success text-[10px]">
            <Activity className="w-3 h-3" />
            <span>Edge AI active</span>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="px-5 -mt-4 grid grid-cols-2 gap-3">
        <div className="bg-card rounded-2xl p-3.5 shadow-soft border border-border">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Marked Today</div>
          <div className="mt-1 flex items-end justify-between">
            <span className="text-2xl font-display font-bold text-navy-deep">128</span>
            <span className="text-[10px] text-success flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+12%</span>
          </div>
        </div>
        <div className="bg-navy-deep rounded-2xl p-3.5 shadow-soft text-white">
          <div className="text-[10px] uppercase tracking-wider text-white/50">Pending Sync</div>
          <div className="mt-1 flex items-end justify-between">
            <span className="text-2xl font-display font-bold">42</span>
            <span className="text-[10px] text-accent-blue">queued</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 mt-5">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: ScanFace, label: "Mark Attendance", sub: "Face + Liveness", primary: true },
            { icon: CloudUpload, label: "Sync Data", sub: "42 pending" },
            { icon: History, label: "View History", sub: "Last 30 days" },
            { icon: Shield, label: "Security Center", sub: "Score 94/100" },
          ].map((a) => (
            <button
              key={a.label}
              className={`text-left rounded-2xl p-3.5 border shadow-soft ${
                a.primary
                  ? "bg-gradient-to-br from-accent-blue to-blue-700 text-white border-transparent"
                  : "bg-card border-border"
              }`}
            >
              <a.icon className={`w-5 h-5 mb-2 ${a.primary ? "text-white" : "text-accent-blue"}`} />
              <div className="text-sm font-semibold">{a.label}</div>
              <div className={`text-[10px] mt-0.5 ${a.primary ? "text-white/70" : "text-muted-foreground"}`}>{a.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-5 mt-5">
        <div className="bg-card rounded-2xl p-4 border border-border shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold">Weekly Activity</div>
              <div className="text-[10px] text-muted-foreground">Verifications per day</div>
            </div>
            <div className="text-[10px] text-accent-blue">This week ▾</div>
          </div>
          <div className="flex items-end gap-2 h-24">
            {[40, 65, 50, 80, 95, 70, 88].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-md ${i === 4 ? "bg-accent-blue" : "bg-secondary"}`}
                  style={{ height: `${h}%` }}
                />
                <span className="text-[9px] text-muted-foreground">{"MTWTFSS"[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-0 inset-x-0 px-5 pb-3 pt-2 bg-card/90 backdrop-blur-xl border-t border-border">
        <div className="flex justify-around items-center">
          {[
            { i: Activity, l: "Home", a: true },
            { i: ScanFace, l: "Scan" },
            { i: History, l: "History" },
            { i: Shield, l: "Security" },
          ].map((n) => (
            <button key={n.l} className="flex flex-col items-center gap-1 py-1">
              <n.i className={`w-5 h-5 ${n.a ? "text-accent-blue" : "text-muted-foreground"}`} />
              <span className={`text-[9px] ${n.a ? "text-accent-blue font-semibold" : "text-muted-foreground"}`}>{n.l}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
