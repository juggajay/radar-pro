"use client";

import { Sun, Cloud, CloudRain, CloudSun } from "lucide-react";
import { cn } from "@/lib/utils";

interface HourData {
  time: string;
  temp: number;
  rainChance: number;
  condition: "sunny" | "partly-cloudy" | "cloudy" | "rain";
  isNow?: boolean;
}

const iconMap = {
  sunny: Sun,
  "partly-cloudy": CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
};

interface HourlyForecastProps {
  hours: HourData[];
}

export function HourlyForecast({ hours }: HourlyForecastProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-3 pb-2">
        {hours.map((hour, index) => {
          const Icon = iconMap[hour.condition];
          return (
            <div
              key={index}
              className={cn(
                "flex-shrink-0 flex flex-col items-center gap-2 py-4 px-4 rounded-2xl min-w-[72px]",
                hour.isNow
                  ? "glass-card border-[#3b82f6] bg-[#3b82f6]/10"
                  : "glass-card"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  hour.isNow ? "text-white" : "text-[#a0a0b0]"
                )}
              >
                {hour.time}
              </span>
              <Icon
                className={cn(
                  "w-7 h-7",
                  hour.condition === "sunny"
                    ? "text-yellow-400"
                    : hour.condition === "rain"
                    ? "text-[#60a5fa]"
                    : "text-white/80"
                )}
              />
              <span className="text-white font-semibold">{hour.temp}°</span>
              <div className="flex items-center gap-1 text-[#60a5fa] text-xs">
                <span>💧</span>
                <span>{hour.rainChance}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
