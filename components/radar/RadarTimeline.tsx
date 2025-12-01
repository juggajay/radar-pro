"use client";

import { cn } from "@/lib/utils";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";

interface RadarTimelineProps {
  mode: "live" | "predict";
  frameIndex: number;
  totalFrames: number;
  onChange: (index: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  frameLabels: string[];
  confidence?: number;
}

export function RadarTimeline({
  mode,
  frameIndex,
  totalFrames,
  onChange,
  isPlaying,
  onPlayPause,
  frameLabels,
  confidence,
}: RadarTimelineProps) {
  if (totalFrames === 0) return null;

  return (
    <div className="w-full space-y-3 px-4">
      {/* Playback controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, frameIndex - 1))}
          disabled={frameIndex === 0}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </button>

        <button
          type="button"
          onClick={onPlayPause}
          className={cn(
            "p-3 rounded-full transition-all",
            mode === "live"
              ? "bg-[#3b82f6] hover:bg-[#2563eb] shadow-lg shadow-blue-500/25"
              : "bg-[#8b5cf6] hover:bg-[#7c3aed] shadow-lg shadow-purple-500/25"
          )}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onChange(Math.min(totalFrames - 1, frameIndex + 1))}
          disabled={frameIndex === totalFrames - 1}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* Timeline slider */}
      <div className="relative">
        <input
          type="range"
          min={0}
          max={totalFrames - 1}
          value={frameIndex}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={cn(
            "w-full h-1.5 rounded-full appearance-none cursor-pointer",
            mode === "live" ? "bg-blue-900/50" : "bg-purple-900/50",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:w-4",
            "[&::-webkit-slider-thumb]:h-4",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:cursor-pointer",
            mode === "live"
              ? "[&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/50"
              : "[&::-webkit-slider-thumb]:bg-[#8b5cf6] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50"
          )}
        />

        {/* Frame label */}
        <div className="flex justify-between mt-2 text-xs text-white/40">
          <span>{mode === "live" ? "Past" : "Now"}</span>
          <span
            className={cn(
              "font-medium",
              mode === "live" ? "text-blue-400" : "text-purple-400"
            )}
          >
            {frameLabels[frameIndex] || "--"}
          </span>
          <span>{mode === "live" ? "Now" : "+2 hrs"}</span>
        </div>
      </div>

      {/* Confidence indicator (predict mode only) */}
      {mode === "predict" && confidence !== undefined && (
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className="text-white/40">Confidence:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  confidence > 70
                    ? "bg-emerald-500"
                    : confidence > 40
                    ? "bg-amber-500"
                    : "bg-red-500"
                )}
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span
              className={cn(
                "font-medium",
                confidence > 70
                  ? "text-emerald-400"
                  : confidence > 40
                  ? "text-amber-400"
                  : "text-red-400"
              )}
            >
              {confidence}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
