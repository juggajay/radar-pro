"use client";

import { Sun, Cloud, CloudRain, CloudSun } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayData {
  day: string;
  condition: "sunny" | "partly-cloudy" | "cloudy" | "rain";
  description: string;
  high: number;
  low: number;
  rainChance: number;
  isToday?: boolean;
}

const iconMap = {
  sunny: Sun,
  "partly-cloudy": CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
};

interface DailyForecastProps {
  days: DayData[];
}

export function DailyForecast({ days }: DailyForecastProps) {
  return (
    <div className="divide-y divide-white/5">
      {days.map((day, index) => {
        const Icon = iconMap[day.condition];
        return (
          <div
            key={index}
            className={cn(
              "flex items-center gap-4 py-4",
              day.isToday && "border-l-4 border-[#3b82f6] -ml-4 pl-4"
            )}
          >
            {/* Day name */}
            <div className="w-24 flex-shrink-0">
              <span
                className={cn(
                  "font-medium",
                  day.isToday ? "text-white" : "text-[#a0a0b0]"
                )}
              >
                {day.day}
              </span>
            </div>

            {/* Icon */}
            <Icon
              className={cn(
                "w-6 h-6 flex-shrink-0",
                day.condition === "sunny"
                  ? "text-yellow-400"
                  : day.condition === "rain"
                  ? "text-[#60a5fa]"
                  : "text-white/80"
              )}
            />

            {/* Description */}
            <span className="flex-1 text-[#a0a0b0] text-sm truncate">
              {day.description}
            </span>

            {/* Temps */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-white font-medium">{day.high}°</span>
              <span className="text-[#606070]">/</span>
              <span className="text-[#606070]">{day.low}°</span>
            </div>

            {/* Rain chance */}
            <div className="flex items-center gap-1 text-[#60a5fa] text-sm w-14 justify-end flex-shrink-0">
              <span>💧</span>
              <span>{day.rainChance}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
