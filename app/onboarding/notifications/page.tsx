"use client";

import { useRouter } from "next/navigation";
import { Bell, Radar } from "lucide-react";
import { GlassCard } from "@/components/layout";

export default function NotificationPermissionPage() {
  const router = useRouter();

  const handleEnableNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
    } catch (error) {
      console.error("Notification permission error:", error);
    }
    router.push("/");
  };

  const handleSkip = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
      {/* Icon with glow */}
      <div className="relative mb-8 animate-fade-in">
        <div className="absolute inset-0 bg-[#3b82f6]/30 blur-3xl rounded-full scale-150" />
        <div className="relative w-20 h-20 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-2xl flex items-center justify-center glow-lg">
          <Bell className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-white mb-3 animate-fade-in stagger-1">
        Never Get Caught
        <br />
        in the Rain
      </h1>
      <p className="text-[#a0a0b0] max-w-xs mb-10 animate-fade-in stagger-2">
        Get notified 15-30 minutes before rain arrives at your location.
      </p>

      {/* Notification preview */}
      <div className="w-full max-w-xs mb-8 animate-fade-in stagger-3">
        <GlassCard className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-[#3b82f6]/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Radar className="w-5 h-5 text-[#3b82f6]" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-white font-medium text-sm">Rain Alert</div>
            <div className="text-[#a0a0b0] text-xs">
              Light rain arriving in ~12 minutes
            </div>
          </div>
          <div className="text-[#606070] text-xs">now</div>
        </GlassCard>
      </div>

      {/* Note */}
      <p className="text-[#606070] text-sm mb-8 animate-fade-in stagger-4">
        You can adjust alert preferences anytime in Settings
      </p>

      {/* Buttons */}
      <div className="w-full max-w-xs space-y-3 animate-fade-in stagger-5">
        <button
          onClick={handleEnableNotifications}
          className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold py-4 px-6 rounded-xl glow-sm hover:opacity-90 transition-opacity"
        >
          Enable Notifications
        </button>
        <button
          onClick={handleSkip}
          className="w-full text-[#3b82f6] font-medium py-3 hover:opacity-80 transition-opacity"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}
