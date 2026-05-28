import { Eye, Smile, RotateCw, ArrowDown, ShieldCheck, CheckCircle2 } from "lucide-react";

export function LivenessScreen() {
  const challenges = [
    { i: Eye, l: "Blink", done: true },
    { i: Smile, l: "Smile", done: true },
    { i: RotateCw, l: "Turn Head", active: true },
    { i: ArrowDown, l: "Nod", done: false },
  ];

  return (
    <div className="relative h-full w-full bg-navy-radial">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative h-full flex flex-col p-5 pt-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Step 3 of 4</div>
            <h2 className="text-lg font-semibold mt-0.5">Liveness Check</h2>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-blue/20 border border-accent-blue/40 text-[10px]">
            <ShieldCheck className="w-3 h-3 text-accent-blue" />
            <span>Anti-Spoof AI</span>
          </div>
        </div>

        {/* Face mesh visual */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-48 h-48">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#2563EB" strokeWidth="1.5"
                strokeDasharray="65 100" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-4 rounded-full glass-card flex items-center justify-center overflow-hidden">
              {/* Mesh dots */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-70">
                {Array.from({ length: 60 }).map((_, i) => {
                  const angle = (i / 60) * Math.PI * 2;
                  const r = 25 + (i % 4) * 4;
                  const cx = 50 + Math.cos(angle) * r;
                  const cy = 50 + Math.sin(angle) * r;
                  return <circle key={i} cx={cx} cy={cy} r="0.7" fill="#60A5FA" />;
                })}
                <g stroke="rgba(96,165,250,0.4)" strokeWidth="0.3" fill="none">
                  <path d="M30 45 Q50 35 70 45" />
                  <path d="M30 60 Q50 75 70 60" />
                  <path d="M40 50 L60 50" />
                </g>
              </svg>
              <RotateCw className="w-12 h-12 text-accent-blue animate-[spin_2.5s_linear_infinite]" strokeWidth={1.2} />
            </div>
          </div>
        </div>

        <div className="mt-5 text-center">
          <div className="text-base font-semibold">Slowly turn your head left</div>
          <div className="text-xs text-white/60 mt-1">Keep your face inside the circle</div>
        </div>

        {/* Challenges grid */}
        <div className="mt-6 glass-white text-foreground rounded-3xl p-4 shadow-card">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Challenges</div>
          <div className="grid grid-cols-2 gap-3">
            {challenges.map((c) => (
              <div
                key={c.l}
                className={`rounded-2xl p-3 border flex items-center gap-3 ${
                  c.done
                    ? "bg-success/10 border-success/30"
                    : c.active
                    ? "bg-accent-blue/10 border-accent-blue/40"
                    : "bg-muted border-border"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    c.done ? "bg-success text-white" : c.active ? "bg-accent-blue text-white" : "bg-card text-muted-foreground"
                  }`}
                >
                  {c.done ? <CheckCircle2 className="w-4 h-4" /> : <c.i className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-semibold">{c.l}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {c.done ? "Verified" : c.active ? "In progress…" : "Pending"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between text-[10px] text-white/40">
          <span>NEURAL ENGINE · ON-DEVICE</span>
          <span>FRAMES 124/180</span>
        </div>
      </div>
    </div>
  );
}
