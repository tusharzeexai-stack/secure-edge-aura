import { ReactNode } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

interface MobileFrameProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  dark?: boolean;
}

export function MobileFrame({ title, subtitle, children, dark }: MobileFrameProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-center">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-accent-blue">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
        )}
      </div>
      <div className="relative w-[320px] h-[680px] rounded-[44px] bg-navy-deep p-[10px] shadow-card">
        <div className="absolute inset-0 rounded-[44px] ring-1 ring-white/10 pointer-events-none" />
        <div
          className={`relative w-full h-full overflow-hidden rounded-[36px] ${
            dark ? "bg-navy-deep" : "bg-background"
          }`}
        >
          {/* Status bar */}
          <div
            className={`absolute top-0 inset-x-0 h-9 z-30 flex items-center justify-between px-6 text-[11px] font-medium ${
              dark ? "text-white" : "text-foreground"
            }`}
          >
            <span>9:41</span>
            <div className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-5 bg-navy-deep rounded-full" />
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <BatteryFull className="w-4 h-4" />
            </div>
          </div>
          <div className="absolute inset-0 pt-9 overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
