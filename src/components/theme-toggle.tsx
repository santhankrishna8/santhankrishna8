"use client";

/* The mounted-guard below is the recommended next-themes SSR pattern. */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="glass relative grid h-10 w-10 place-items-center rounded-full transition-transform hover:scale-105 active:scale-95"
    >
      {mounted ? (
        isDark ? (
          <Moon className="h-[18px] w-[18px] text-brand-2" />
        ) : (
          <Sun className="h-[18px] w-[18px] text-brand" />
        )
      ) : (
        <span className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
