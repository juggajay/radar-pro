"use client";

import { Cloud, Droplets, Wind, Sun } from "lucide-react";
import { GlassCard } from "@/components/layout";

interface CurrentConditionsProps {
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  wind: string;
  uvIndex: number;
  rainETA?: number;
}

export function CurrentConditions({
  temperature,
  feelsLike,
  condition,
  humidity,
  wind,
  uvIndex,
  rainETA,
}: CurrentConditionsProps) {
  return (
    <GlassCard className="mx-4">
      {/* Temperature and condition row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-6xl font-light text-white tracking-tighter">
            {temperature}°
          </div>
          <div>
            <div className="text-white font-medium">Now</div>
            <div className="text-[#a0a0b0] text-sm">{condition}</div>
            <div className="text-[#606070] text-xs">Feels like {feelsLike}°</div>
          </div>
        </div>
        <Cloud className="w-12 h-12 text-white/80" />
      </div>

      {/* Rain alert */}
      {rainETA && (
        <div className="flex items-center gap-2 py-3 px-4 -mx-4 mb-4 border-l-4 border-[#3b82f6] bg-[#3b82f6]/10">
          <Droplets className="w-5 h-5 text-[#3b82f6]" />
          <span className="text-white text-sm">
            Light rain arriving in ~{rainETA} minutes
          </span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-[#a0a0b0] text-xs mb-1">Humidity</div>
          <div className="text-white font-medium">{humidity}%</div>
        </div>
        <div className="text-center">
          <div className="text-[#a0a0b0] text-xs mb-1">Wind</div>
          <div className="text-white font-medium">{wind}</div>
        </div>
        <div className="text-center">
          <div className="text-[#a0a0b0] text-xs mb-1">UV Index</div>
          <div className="text-white font-medium">{uvIndex}</div>
        </div>
      </div>
    </GlassCard>
  );
}
