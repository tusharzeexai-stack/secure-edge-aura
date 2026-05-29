import {
  ScanFace,
  CloudUpload,
  History,
  Shield,
  TrendingUp,
  WifiOff,
  Activity,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export function DashboardScreen() {
  const stats = [
    { label: "Marked Today", value: "128", delta: "+12%", positive: true, sub: "verifications" },
    { label: "Pending Sync", value: "42", delta: "queued", positive: null, sub: "records offline" },
    { label: "Active Officers", value: "18", delta: "+3", positive: true, sub: "on field" },
    { label: "Security Score", value: "94", delta: "/100", positive: null, sub: "excellent posture" },
  ];

  const quickActions = [
    { icon: ScanFace,    label: "Mark Attendance", sub: "Face + Liveness",   primary: true },
    { icon: CloudUpload, label: "Sync Data",        sub: "42 pending",        primary: false },
    { icon: History,     label: "View History",     sub: "Last 30 days",      primary: false },
    { icon: Shield,      label: "Security Center",  sub: "Score 94/100",      primary: false },
  ];

  const recentActivity = [
    { name: "Priya Sharma",  time: "09:42", loc: "Sector 14", score: 96, ok: true },
    { name: "Rohan Mehta",   time: "09:38", loc: "Sector 14", score: 92, ok: true },
    { name: "Anita Iyer",    time: "09:31", loc: "Sector 12", score: 98, ok: true },
    { name: "Karan Patel",   time: "08:55", loc: "Sector 09", score: 89, ok: true },
    { name: "Vikram Singh",  time: "08:40", loc: "Sector 09", score: 74, ok: false },
  ];

  return (
    <div className="min-h-full w-full bg-[#f8fafc] p-6 space-y-6">

      {/* ── Status strip ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e2e8f0] text-[11px] text-[#64748b] shadow-sm">
          <WifiOff className="w-3 h-3 text-emerald-500" />
          Offline · Last sync 2h ago
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px]">
          <Activity className="w-3 h-3" />
          Edge AI Active
        </div>
        <div className="ml-auto text-[11px] text-[#64748b]">
          Thursday, 28 May 2026
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-sm flex flex-col gap-1"
          >
            <div className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-medium">
              {s.label}
            </div>
            <div className="flex items-end justify-between mt-1">
              <span className="text-3xl font-bold text-[#0A192F] font-display leading-none">
                {s.value}
              </span>
              {s.delta && (
                <span
                  className={`text-[11px] font-semibold ${
                    s.positive === true
                      ? "text-emerald-500"
                      : s.positive === false
                      ? "text-red-500"
                      : "text-[#2563EB]"
                  }`}
                >
                  {s.positive === true && <TrendingUp className="w-3 h-3 inline mr-0.5" />}
                  {s.delta}
                </span>
              )}
            </div>
            <div className="text-[10px] text-[#94a3b8] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Quick actions + Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Quick actions */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-4">
            Quick Actions
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                className={`text-left rounded-xl p-3.5 border transition-all hover:scale-[1.02] ${
                  a.primary
                    ? "bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] text-white border-transparent shadow-md shadow-blue-200"
                    : "bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]"
                }`}
              >
                <a.icon
                  className={`w-5 h-5 mb-2 ${a.primary ? "text-white" : "text-[#2563EB]"}`}
                />
                <div className={`text-xs font-semibold leading-tight ${a.primary ? "text-white" : "text-[#0A192F]"}`}>
                  {a.label}
                </div>
                <div className={`text-[10px] mt-0.5 ${a.primary ? "text-white/70" : "text-[#94a3b8]"}`}>
                  {a.sub}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Weekly chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm font-semibold text-[#0A192F]">Weekly Activity</div>
              <div className="text-[11px] text-[#94a3b8]">Verifications per day</div>
            </div>
            <div className="text-[11px] text-[#2563EB] font-medium cursor-pointer hover:underline">
              This week ▾
            </div>
          </div>
          <div className="flex items-end gap-2 h-36">
            {[40, 65, 50, 80, 95, 70, 88].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className={`w-full rounded-md transition-all ${
                    i === 4
                      ? "bg-[#2563EB] shadow-sm shadow-blue-200"
                      : "bg-[#e2e8f0] hover:bg-[#cbd5e1]"
                  }`}
                  style={{ height: `${h}%` }}
                />
                <span className={`text-[10px] font-medium ${i === 4 ? "text-[#2563EB]" : "text-[#94a3b8]"}`}>
                  {"MTWTFSS"[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent activity ── */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
          <div>
            <div className="text-sm font-semibold text-[#0A192F]">Recent Verifications</div>
            <div className="text-[11px] text-[#94a3b8]">Live attendance log</div>
          </div>
          <button className="text-[11px] text-[#2563EB] hover:underline font-medium">
            View all →
          </button>
        </div>
        <div className="divide-y divide-[#f1f5f9]">
          {recentActivity.map((r) => (
            <div key={r.name} className="flex items-center gap-4 px-5 py-3 hover:bg-[#f8fafc] transition-colors">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0A192F] to-[#112240] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {r.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#0A192F] truncate">{r.name}</div>
                <div className="text-[11px] text-[#94a3b8] flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> {r.time} · {r.loc}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`flex items-center gap-1 text-[11px] font-medium ${r.ok ? "text-emerald-600" : "text-red-500"}`}>
                  {r.ok
                    ? <><CheckCircle2 className="w-3.5 h-3.5" /> Verified</>
                    : <><AlertTriangle className="w-3.5 h-3.5" /> Flagged</>
                  }
                </div>
                <div className="text-[10px] text-[#94a3b8]">{r.score}% match</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
