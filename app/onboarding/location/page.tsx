"use client";

import { useRouter } from "next/navigation";
import { MapPin, Lock } from "lucide-react";

export default function LocationPermissionPage() {
  const router = useRouter();

  const handleEnableLocation = async () => {
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });

      if (permission.state === "granted") {
        router.push("/onboarding/notifications");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          router.push("/onboarding/notifications");
        },
        () => {
          router.push("/onboarding/notifications");
        }
      );
    } catch {
      router.push("/onboarding/notifications");
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/notifications");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
      {/* Icon with glow */}
      <div className="relative mb-8 animate-fade-in">
        <div className="absolute inset-0 bg-[#3b82f6]/30 blur-3xl rounded-full scale-150" />
        <div className="relative w-20 h-20 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-2xl flex items-center justify-center glow-lg">
          <MapPin className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-white mb-3 animate-fade-in stagger-1">
        Enable Location
      </h1>
      <p className="text-[#a0a0b0] max-w-xs mb-10 animate-fade-in stagger-2">
        RadarPro uses your location to show the nearest weather radar and deliver accurate local forecasts.
      </p>

      {/* Map preview */}
      <div className="relative w-full max-w-xs aspect-[4/3] mb-8 animate-fade-in stagger-3">
        <div className="absolute inset-0 glass-card overflow-hidden">
          {/* Map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a24] to-[#12121a]" />

          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
            {[...Array(10)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 10}
                x2="100"
                y2={i * 10}
                stroke="#3b82f6"
                strokeWidth="0.5"
              />
            ))}
            {[...Array(10)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 10}
                y1="0"
                x2={i * 10}
                y2="100"
                stroke="#3b82f6"
                strokeWidth="0.5"
              />
            ))}
          </svg>

          {/* Location marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 w-8 h-8 bg-[#3b82f6] rounded-full animate-ping opacity-30" />
              <div className="relative w-8 h-8 bg-[#3b82f6] rounded-full border-4 border-white shadow-lg" />
            </div>
          </div>

          {/* Radius circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[#3b82f6]/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#3b82f6]/20 rounded-full" />
        </div>
      </div>

      {/* Privacy note */}
      <div className="flex items-center gap-2 text-[#606070] text-sm mb-8 animate-fade-in stagger-4">
        <Lock className="w-4 h-4" />
        <span>Your location is never shared or stored.</span>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-xs space-y-3 animate-fade-in stagger-5">
        <button
          onClick={handleEnableLocation}
          className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold py-4 px-6 rounded-xl glow-sm hover:opacity-90 transition-opacity"
        >
          Enable Location
        </button>
        <button
          onClick={handleSkip}
          className="w-full text-[#3b82f6] font-medium py-3 hover:opacity-80 transition-opacity"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
