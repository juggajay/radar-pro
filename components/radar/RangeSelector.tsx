"use client";

import { cn } from "@/lib/utils";

const ranges = ["64", "128", "256", "512"];

interface RangeSelectorProps {
  value: string;
  onChange: (range: string) => void;
}

export function RangeSelector({ value, onChange }: RangeSelectorProps) {
  const handleClick = (range: string) => {
    console.log("Range button clicked:", range);
    onChange(range);
  };

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
          type="button"
          onClick={() => handleClick(range)}
          className={cn(
            "relative px-3.5 py-1.5 text-sm rounded-full transition-all duration-200 cursor-pointer",
            value === range
              ? "text-white font-medium bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-[0_2px_8px_rgba(59,130,246,0.4)]"
              : "text-white/50 hover:text-white/80"
          )}
        >
          {range}km
        </button>
      ))}
    </div>
  );
}
