"use client";

import { Header, BottomNav, GlassCard } from "@/components/layout";
import { HourlyForecast, DailyForecast } from "@/components/weather";

// Mock data - would come from BOM API
const hourlyData = [
  { time: "Now", temp: 23, rainChance: 0, condition: "partly-cloudy" as const, isNow: true },
  { time: "3 PM", temp: 22, rainChance: 20, condition: "cloudy" as const },
  { time: "4 PM", temp: 21, rainChance: 40, condition: "cloudy" as const },
  { time: "5 PM", temp: 20, rainChance: 60, condition: "rain" as const },
  { time: "6 PM", temp: 19, rainChance: 80, condition: "rain" as const },
  { time: "7 PM", temp: 18, rainChance: 50, condition: "rain" as const },
  { time: "8 PM", temp: 18, rainChance: 30, condition: "cloudy" as const },
  { time: "9 PM", temp: 17, rainChance: 10, condition: "cloudy" as const },
];

const dailyData = [
  { day: "Today", condition: "partly-cloudy" as const, description: "Partly cloudy", high: 26, low: 18, rainChance: 20, isToday: true },
  { day: "Tomorrow", condition: "rain" as const, description: "Showers", high: 22, low: 16, rainChance: 80 },
  { day: "Wednesday", condition: "rain" as const, description: "Rain clearing", high: 21, low: 15, rainChance: 60 },
  { day: "Thursday", condition: "cloudy" as const, description: "Cloudy", high: 23, low: 16, rainChance: 30 },
  { day: "Friday", condition: "partly-cloudy" as const, description: "Partly cloudy", high: 25, low: 17, rainChance: 10 },
  { day: "Saturday", condition: "sunny" as const, description: "Sunny", high: 28, low: 18, rainChance: 0 },
  { day: "Sunday", condition: "sunny" as const, description: "Mostly sunny", high: 29, low: 19, rainChance: 5 },
];

export default function ForecastPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <Header title="Sydney Forecast" showBack showSettings={false} />

      <div className="px-4 space-y-6">
        {/* Today's summary card */}
        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-white text-lg font-semibold">Today</h2>
              <p className="text-[#a0a0b0] text-sm">Partly cloudy with a chance of afternoon showers</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-light text-white">26°</div>
              <div className="text-[#606070] text-sm">/ 18°</div>
            </div>
          </div>
        </GlassCard>

        {/* Hourly forecast */}
        <div>
          <h3 className="text-white font-semibold mb-4">Hourly Forecast</h3>
          <HourlyForecast hours={hourlyData} />
        </div>

        {/* 7-day forecast */}
        <GlassCard>
          <h3 className="text-white font-semibold mb-2">7-Day Forecast</h3>
          <DailyForecast days={dailyData} />
        </GlassCard>

        {/* Attribution */}
        <p className="text-center text-[#606070] text-xs">
          Data sourced from Bureau of Meteorology
        </p>
      </div>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
