"use client";

import { motion } from "framer-motion";
import { CATEGORIES, type Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryTabs({
  value,
  onChange,
}: {
  value: Category;
  onChange: (c: Category) => void;
}) {
  return (
    <div className="glass inline-flex rounded-full p-1">
      {CATEGORIES.map((cat) => {
        const active = cat.id === value;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={cn(
              "relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active ? "text-white" : "text-muted hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="cat-pill"
                className="brand-gradient absolute inset-0 -z-10 rounded-full shadow-md"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span aria-hidden>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
