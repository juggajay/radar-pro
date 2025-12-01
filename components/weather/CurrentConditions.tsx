"use client";

import { Cloud, Droplets, CloudRain, CloudOff } from "lucide-react";
import { GlassCard } from "@/components/layout";
import { useRainPrediction } from "@/hooks/useRainPrediction";

interface CurrentConditionsProps {
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  wind: string;
  uvIndex: number;
  radarId?: string;
  lat?: number;
  lng?: number;
}

export function CurrentConditions({
  temperature,
  feelsLike,
  condition,
  humidity,
  wind,
  uvIndex,
  radarId,
  lat = -33.8688,
  lng = 151.2093,
}: CurrentConditionsProps) {
  const { prediction, isLoading } = useRainPrediction({ lat, lng, radarId });

  // Determine alert styling based on intensity
  const getAlertStyle = (intensity: string | null) => {
    switch (intensity) {
      case "heavy":
        return {
          border: "border-red-500",
          bg: "bg-red-500/10",
          icon: "text-red-500",
          label: "Heavy",
        };
      case "moderate":
        return {
          border: "border-orange-500",
          bg: "bg-orange-500/10",
          icon: "text-orange-500",
          label: "Moderate",
        };
      default:
        return {
          border: "border-[#3b82f6]",
          bg: "bg-[#3b82f6]/10",
          icon: "text-[#3b82f6]",
          label: "Light",
        };
    }
  };

  const alertStyle = prediction ? getAlertStyle(prediction.intensity) : null;

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

      {/* Rain prediction alert */}
      {isLoading ? (
        <div className="flex items-center gap-2 py-3 px-4 -mx-4 mb-4 border-l-4 border-white/20 bg-white/5">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
          <span className="text-white/60 text-sm">Analyzing radar...</span>
        </div>
      ) : prediction?.willRain ? (
        <div
          className={`flex items-center gap-2 py-3 px-4 -mx-4 mb-4 border-l-4 ${alertStyle?.border} ${alertStyle?.bg}`}
        >
          {prediction.intensity === "heavy" ? (
            <CloudRain className={`w-5 h-5 ${alertStyle?.icon}`} />
          ) : (
            <Droplets className={`w-5 h-5 ${alertStyle?.icon}`} />
          )}
          <span className="text-white text-sm">
            {prediction.minutesUntil === 0 ? (
              <>{alertStyle?.label} rain overhead now</>
            ) : (
              <>
                {alertStyle?.label} rain arriving in ~{prediction.minutesUntil} minutes
                {prediction.direction && prediction.direction !== "overhead" && (
                  <span className="text-white/60"> from {prediction.direction}</span>
                )}
              </>
            )}
          </span>
          {prediction.confidence > 0 && (
            <span className="ml-auto text-white/40 text-xs">{prediction.confidence}%</span>
          )}
        </div>
      ) : prediction ? (
        <div className="flex items-center gap-2 py-3 px-4 -mx-4 mb-4 border-l-4 border-emerald-500/50 bg-emerald-500/10">
          <CloudOff className="w-5 h-5 text-emerald-500" />
          <span className="text-white/80 text-sm">No rain expected</span>
        </div>
      ) : null}

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
