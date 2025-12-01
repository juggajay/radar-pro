"use client";

import { useState } from "react";
import Link from "next/link";
import { Header, BottomNav, GlassCard } from "@/components/layout";
import { Switch } from "@/components/ui/switch";
import { Star, ChevronRight, Bell, Sun, Wind, Moon } from "lucide-react";

export default function SettingsPage() {
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [windUnit, setWindUnit] = useState<"kmh" | "mph">("kmh");
  const [darkMode, setDarkMode] = useState(true);
  const [rainAlerts, setRainAlerts] = useState(true);
  const [severeWeather, setSevereWeather] = useState(true);
  const [dailyForecast, setDailyForecast] = useState(false);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <Header title="Settings" showBack showSettings={false} />

      <div className="px-4 space-y-6">
        {/* Display section */}
        <div>
          <h3 className="text-[#606070] text-xs font-medium uppercase tracking-wider mb-3">
            Display
          </h3>
          <GlassCard padding="none">
            {/* Temperature */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <span className="text-white">Temperature</span>
              <div className="flex bg-[#1a1a24] rounded-lg p-1">
                <button
                  onClick={() => setTempUnit("C")}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    tempUnit === "C"
                      ? "bg-[#3b82f6] text-white"
                      : "text-[#a0a0b0]"
                  }`}
                >
                  °C
                </button>
                <button
                  onClick={() => setTempUnit("F")}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    tempUnit === "F"
                      ? "bg-[#3b82f6] text-white"
                      : "text-[#a0a0b0]"
                  }`}
                >
                  °F
                </button>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <span className="text-white">Wind Speed</span>
              <div className="flex bg-[#1a1a24] rounded-lg p-1">
                <button
                  onClick={() => setWindUnit("kmh")}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    windUnit === "kmh"
                      ? "bg-[#3b82f6] text-white"
                      : "text-[#a0a0b0]"
                  }`}
                >
                  km/h
                </button>
                <button
                  onClick={() => setWindUnit("mph")}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    windUnit === "mph"
                      ? "bg-[#3b82f6] text-white"
                      : "text-[#a0a0b0]"
                  }`}
                >
                  mph
                </button>
              </div>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[#a0a0b0]" />
                <span className="text-white">Dark Mode</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </GlassCard>
        </div>

        {/* Notifications section */}
        <div>
          <h3 className="text-[#606070] text-xs font-medium uppercase tracking-wider mb-3">
            Notifications
          </h3>
          <GlassCard padding="none">
            {/* Rain Alerts */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#a0a0b0]" />
                <span className="text-white">Rain Alerts</span>
              </div>
              <Switch checked={rainAlerts} onCheckedChange={setRainAlerts} />
            </div>

            {/* Severe Weather */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#a0a0b0]" />
                <span className="text-white">Severe Weather Warnings</span>
              </div>
              <Switch
                checked={severeWeather}
                onCheckedChange={setSevereWeather}
              />
            </div>

            {/* Daily Forecast */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-[#a0a0b0]" />
                <span className="text-white">Daily Forecast</span>
              </div>
              <Switch
                checked={dailyForecast}
                onCheckedChange={setDailyForecast}
              />
            </div>
          </GlassCard>
        </div>

        {/* Account section */}
        <div>
          <h3 className="text-[#606070] text-xs font-medium uppercase tracking-wider mb-3">
            Account
          </h3>
          <Link href="/pro">
            <GlassCard className="flex items-center justify-between bg-[#3b82f6]/10 border-[#3b82f6]/30">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-[#3b82f6]" />
                <span className="text-[#3b82f6] font-medium">
                  Upgrade to Pro
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#3b82f6]" />
            </GlassCard>
          </Link>
        </div>

        {/* About section */}
        <div>
          <h3 className="text-[#606070] text-xs font-medium uppercase tracking-wider mb-3">
            About
          </h3>
          <GlassCard padding="none">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <span className="text-white">Version</span>
              <span className="text-[#a0a0b0]">1.0.0</span>
            </div>
            <Link
              href="/privacy"
              className="flex items-center justify-between p-4 border-b border-white/5"
            >
              <span className="text-white">Privacy Policy</span>
              <ChevronRight className="w-5 h-5 text-[#606070]" />
            </Link>
            <Link
              href="/terms"
              className="flex items-center justify-between p-4"
            >
              <span className="text-white">Terms of Service</span>
              <ChevronRight className="w-5 h-5 text-[#606070]" />
            </Link>
          </GlassCard>
        </div>

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
