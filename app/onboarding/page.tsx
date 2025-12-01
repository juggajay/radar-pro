"use client";

import Link from "next/link";
import { Radar, CloudRain, Calendar, Check } from "lucide-react";

const features = [
  { icon: Radar, text: "Real-time BOM radar" },
  { icon: CloudRain, text: "Rain alerts before it hits" },
  { icon: Calendar, text: "7-day forecasts" },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
      {/* Logo with glow */}
      <div className="relative mb-8 animate-fade-in">
        <div className="absolute inset-0 bg-[#3b82f6]/30 blur-3xl rounded-full" />
        <div className="relative w-24 h-24 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-3xl flex items-center justify-center glow-lg">
          <Radar className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in stagger-1">
        Radar<span className="text-[#3b82f6]">Pro</span>
      </h1>
      <p className="text-[#a0a0b0] text-lg mb-10 animate-fade-in stagger-2">
        Australia&apos;s fastest weather radar
      </p>

      {/* Radar preview image */}
      <div className="relative w-full max-w-xs aspect-[4/3] mb-10 animate-fade-in stagger-3">
        <div className="absolute inset-0 glass-card overflow-hidden">
          {/* Australia map silhouette with radar overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#12121a] to-[#0a0a0f]" />
          <svg
            viewBox="0 0 200 150"
            className="absolute inset-0 w-full h-full opacity-30"
          >
            <path
              d="M120,20 Q160,30 170,60 Q175,90 160,110 Q140,130 100,125 Q60,120 40,100 Q20,80 30,50 Q40,30 70,25 Q100,15 120,20"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1"
            />
          </svg>
          {/* Radar pulse effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 rounded-full border border-[#3b82f6]/20 animate-ping" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-[#3b82f6]/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-[#3b82f6]/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#3b82f6]/50" />
          </div>
          {/* Rain cells */}
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-[#60a5fa] to-[#8b5cf6] rounded-full blur-xl opacity-60" />
          <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] rounded-full blur-lg opacity-50" />
        </div>
      </div>

      {/* Features list */}
      <div className="w-full max-w-xs space-y-4 mb-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 animate-fade-in stagger-${index + 3}`}
          >
            <div className="w-6 h-6 rounded-full bg-[#3b82f6]/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-[#3b82f6]" />
            </div>
            <span className="text-[#a0a0b0]">{feature.text}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Link
        href="/onboarding/location"
        className="w-full max-w-xs bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold py-4 px-6 rounded-xl glow-sm hover:opacity-90 transition-opacity animate-fade-in stagger-5"
      >
        Get Started
      </Link>

      {/* Terms */}
      <p className="text-[#606070] text-xs mt-6 animate-fade-in stagger-5">
        <Link href="/terms" className="hover:text-[#a0a0b0] transition-colors">
          Terms of Service
        </Link>
        {" and "}
        <Link href="/privacy" className="hover:text-[#a0a0b0] transition-colors">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
