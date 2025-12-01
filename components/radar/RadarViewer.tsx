"use client";

import { useState, useEffect } from "react";
import { RangeSelector } from "./RangeSelector";
import { RadarControls } from "./RadarControls";

interface RadarViewerProps {
  radarId: string;
  cityName: string;
}

export function RadarViewer({ radarId, cityName }: RadarViewerProps) {
  const [range, setRange] = useState("128");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(100);
  const [currentFrame, setCurrentFrame] = useState(5);

  // Simulate radar animation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const next = prev >= 5 ? 0 : prev + 1;
        setProgress(((next + 1) / 6) * 100);
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const radarImageUrl = `https://www.bom.gov.au/radar/${radarId}.T.${range}.png`;
  const backgroundUrl = `https://www.bom.gov.au/radar/${radarId}.background.${range}.png`;

  return (
    <div className="relative w-full h-[60vh] min-h-[400px]">
      {/* Background terrain */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundUrl})`,
          filter: "brightness(0.7) saturate(0.8)",
        }}
      />

      {/* Radar overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-screen"
        style={{
          backgroundImage: `url(${radarImageUrl})`,
        }}
      />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/50 via-transparent to-transparent" />

      {/* Location marker (center) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="absolute inset-0 w-5 h-5 bg-[#3b82f6] rounded-full animate-ping opacity-40" />
          <div className="relative w-5 h-5 bg-[#3b82f6] rounded-full border-3 border-white shadow-lg glow-accent" />
        </div>
      </div>

      {/* Range selector - top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {/* Playback controls - bottom */}
      <div className="absolute bottom-4 left-4 z-20">
        <RadarControls
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          progress={progress}
          lastUpdated="2m ago"
        />
      </div>

      {/* City labels (example - positioned relative to center) */}
      <div className="absolute top-1/3 left-1/4 text-white/60 text-xs font-medium">
        {cityName === "Sydney" ? "Parramatta" : ""}
      </div>
      <div className="absolute top-1/2 right-1/3 text-white/60 text-xs font-medium">
        {cityName === "Sydney" ? "Sydney CBD" : cityName}
      </div>
    </div>
  );
}
