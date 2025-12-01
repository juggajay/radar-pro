"use client";

import { cn } from "@/lib/utils";

const ranges = ["64", "128", "256", "512"];

interface RangeSelectorProps {
  value: string;
  onChange: (range: string) => void;
}

export function RangeSelector({ value, onChange }: RangeSelectorProps) {
  return (
    <div className="flex bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/10">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={cn(
            "px-3 py-1.5 text-sm rounded-full transition-all",
            value === range
              ? "bg-[#3b82f6] text-white font-medium"
              : "text-[#a0a0b0] hover:text-white"
          )}
        >
          {range}km
        </button>
      ))}
    </div>
  );
}
