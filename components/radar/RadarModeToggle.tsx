"use client";

import { cn } from "@/lib/utils";

type RadarMode = "live" | "predict";

interface RadarModeToggleProps {
  mode: RadarMode;
  onChange: (mode: RadarMode) => void;
  isLoading?: boolean;
}

export function RadarModeToggle({ mode, onChange, isLoading }: RadarModeToggleProps) {
  return (
    <div
      className="flex rounded-full p-1 border border-white/10"
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      }}
    >
      <button
        type="button"
        onClick={() => onChange("live")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
          mode === "live"
            ? "bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shadow-[0_2px_8px_rgba(59,130,246,0.4)]"
            : "text-white/50 hover:text-white/80"
        )}
      >
        <span className="relative flex h-2 w-2">
          {mode === "live" ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current opacity-50" />
          )}
        </span>
        LIVE
      </button>

      <button
        type="button"
        onClick={() => onChange("predict")}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
          mode === "predict"
            ? "bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white shadow-[0_2px_8px_rgba(139,92,246,0.4)]"
            : "text-white/50 hover:text-white/80",
          isLoading && "opacity-50 cursor-wait"
        )}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        {isLoading ? "..." : "PREDICT"}
      </button>
    </div>
  );
}
