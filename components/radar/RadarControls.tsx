"use client";

import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface RadarControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  progress: number;
  lastUpdated: string;
}

export function RadarControls({
  isPlaying,
  onPlayPause,
  progress,
  lastUpdated,
}: RadarControlsProps) {
  return (
    <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
      <button
        onClick={onPlayPause}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-white" />
        ) : (
          <Play className="w-4 h-4 text-white ml-0.5" />
        )}
      </button>

      <div className="relative w-24 h-1 bg-white/20 rounded-full">
        <div
          className="absolute inset-y-0 left-0 bg-[#3b82f6] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-300",
            isPlaying && "animate-pulse"
          )}
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      <span className="text-[#a0a0b0] text-xs whitespace-nowrap">
        Updated {lastUpdated}
      </span>
    </div>
  );
}
