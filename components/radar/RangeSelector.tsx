"use client";

import { cn } from "@/lib/utils";

const ranges = ["64", "128", "256", "512"];

interface RangeSelectorProps {
  value: string;
  onChange: (range: string) => void;
}

export function RangeSelector({ value, onChange }: RangeSelectorProps) {
  return (
    <div
      className="flex rounded-full p-1 border border-white/10"
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      }}
    >
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={cn(
            "relative px-3.5 py-1.5 text-sm rounded-full transition-all duration-200",
            value === range
              ? "text-white font-medium"
              : "text-white/50 hover:text-white/80"
          )}
        >
          {value === range && (
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)",
              }}
            />
          )}
          <span className="relative">{range}km</span>
        </button>
      ))}
    </div>
  );
}
