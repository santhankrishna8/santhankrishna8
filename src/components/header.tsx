import { Sparkles } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 px-4 pt-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="brand-gradient grid h-9 w-9 place-items-center rounded-xl shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold tracking-tight">
              Spot<span className="gradient-text">light</span>
            </p>
            <p className="hidden text-[11px] text-muted sm:block">
              Find the best around you
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-muted sm:inline">
            ✨ AI-powered
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
