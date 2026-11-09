"use client";

import React from "react";
import { Search, X } from "lucide-react";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
}) => {
  return (
    <div className={`relative flex items-center w-full max-w-sm ${className || ""}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-hpl-accent pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 rounded-xl border border-hpl-border bg-hpl-surface-2 text-sm text-white placeholder-hpl-muted focus:outline-none focus:ring-2 focus:ring-hpl-accent/30 focus:border-hpl-accent shadow-card"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 text-hpl-muted hover:text-white p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
