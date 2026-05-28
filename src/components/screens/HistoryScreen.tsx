import { Search, SlidersHorizontal, ShieldCheck, Clock } from "lucide-react";

export function HistoryScreen() {
  const groups = [
    {
      date: "Today · 28 May",
      items: [
        { name: "Priya Sharma", time: "09:42", score: 96, loc: "Sector 14" },
        { name: "Rohan Mehta", time: "09:38", score: 92, loc: "Sector 14" },
        { name: "Anita Iyer", time: "09:31", score: 98, loc: "Sector 12" },
      ],
    },
    {
      date: "Yesterday",
      items: [
        { name: "Karan Patel", time: "17:08", score: 89, loc: "Sector 09" },
        { name: "Vikram Singh", time: "16:55", score: 94, loc: "Sector 09" },
      ],
    },
  ];

  return (
    <div className="h-full w-full bg-background">
      <div className="px-5 pt-4 pb-3 bg-card border-b border-border">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Records</div>
        <h1 className="text-xl font-semibold text-navy-deep mt-0.5">Attendance History</h1>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-muted border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search name, ID or location"
              className="bg-transparent outline-none text-xs flex-1 placeholder:text-muted-foreground"
            />
          </div>
          <button className="w-9 h-9 rounded-xl bg-navy-deep text-white flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {["All", "Verified", "Flagged", "This week", "Sector 14"].map((t, i) => (
            <button
              key={t}
              className={`text-[11px] px-3 py-1.5 rounded-full whitespace-nowrap ${
                i === 0
                  ? "bg-accent-blue text-white"
                  : "bg-muted text-foreground border border-border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {groups.map((g) => (
          <div key={g.date}>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {g.date}
              </div>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="relative pl-5 space-y-3">
              <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border" />
              {g.items.map((r, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[14px] top-4 w-2 h-2 rounded-full bg-accent-blue ring-4 ring-background" />
                  <div className="bg-card rounded-2xl p-3.5 border border-border shadow-soft flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-deep to-navy-rich text-white text-xs font-bold flex items-center justify-center">
                      {r.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{r.name}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                        <Clock className="w-3 h-3" /> {r.time} · {r.loc}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-success text-[10px] font-medium">
                        <ShieldCheck className="w-3 h-3" /> AI Verified
                      </div>
                      <div className="text-[10px] text-muted-foreground">{r.score}% match</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
