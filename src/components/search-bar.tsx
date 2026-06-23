"use client";

import { useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";

export function SearchBar({
  onSearch,
  onLocate,
  locating,
  placeholder,
}: {
  onSearch: (q: string) => void;
  onLocate: () => void;
  locating?: boolean;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(q.trim());
      }}
      className="glass flex items-center gap-2 rounded-full p-1.5 pl-4"
    >
      <Search className="h-[18px] w-[18px] shrink-0 text-muted" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder ?? "Search a city or area…"}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        aria-label="Search location"
      />
      <button
        type="button"
        onClick={onLocate}
        title="Use my location"
        aria-label="Use my location"
        className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-brand"
      >
        {locating ? (
          <Loader2 className="h-[18px] w-[18px] animate-spin" />
        ) : (
          <MapPin className="h-[18px] w-[18px]" />
        )}
      </button>
      <button
        type="submit"
        className="brand-gradient rounded-full px-5 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.03] active:scale-95"
      >
        Search
      </button>
    </form>
  );
}
