"use client";

import { useState } from "react";
import { Header, GlassCard } from "@/components/layout";
import { Check, Star, Zap, Cloud, MapPin, History, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  { icon: Shield, text: "Ad-free experience" },
  { icon: Zap, text: "Lightning strike map" },
  { icon: Cloud, text: "Rain arrival alerts" },
  { icon: History, text: "Historical radar playback" },
  { icon: MapPin, text: "Unlimited saved locations" },
  { icon: Cloud, text: "Storm tracking overlay" },
  { icon: Zap, text: "Priority weather updates" },
];

export default function ProPage() {
  const [selectedPlan, setSelectedPlan] = useState<"annual" | "monthly">(
    "annual"
  );

  const handleSubscribe = () => {
    // TODO: Integrate Stripe checkout
    console.log("Subscribe to:", selectedPlan);
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <Header title="Upgrade to Pro" showBack showSettings={false} />

      <div className="px-4 space-y-6">
        {/* Hero section */}
        <div className="text-center py-4">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-[#3b82f6]/30 blur-2xl rounded-full" />
            <div className="relative w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center">
              <Star className="w-10 h-10 text-white" fill="white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            RadarPro <span className="text-[#3b82f6]">PRO</span>
          </h1>
          <p className="text-[#a0a0b0]">
            Unlock the full power of weather intelligence
          </p>
        </div>

        {/* Features list */}
        <GlassCard>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#3b82f6]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#3b82f6]" />
                </div>
                <span className="text-white">{feature.text}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Pricing cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Annual */}
          <button
            onClick={() => setSelectedPlan("annual")}
            className={cn(
              "relative p-4 rounded-2xl text-center transition-all",
              selectedPlan === "annual"
                ? "glass-card border-[#3b82f6] bg-[#3b82f6]/10 glow-sm"
                : "glass-card"
            )}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
              <span className="bg-[#3b82f6] text-white text-xs font-semibold px-2 py-0.5 rounded">
                BEST VALUE
              </span>
            </div>
            <div className="text-white font-semibold mt-2">Annual</div>
            <div className="text-2xl font-bold text-white mt-1">
              $39.99
              <span className="text-sm text-[#a0a0b0] font-normal">/year</span>
            </div>
            <div className="text-[#22c55e] text-sm mt-1">Save 33%</div>
          </button>

          {/* Monthly */}
          <button
            onClick={() => setSelectedPlan("monthly")}
            className={cn(
              "p-4 rounded-2xl text-center transition-all",
              selectedPlan === "monthly"
                ? "glass-card border-[#3b82f6] bg-[#3b82f6]/10 glow-sm"
                : "glass-card"
            )}
          >
            <div className="text-white font-semibold mt-4">Monthly</div>
            <div className="text-2xl font-bold text-white mt-1">
              $4.99
              <span className="text-sm text-[#a0a0b0] font-normal">/month</span>
            </div>
            <div className="text-transparent text-sm mt-1">-</div>
          </button>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <button
            onClick={handleSubscribe}
            className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold py-4 px-6 rounded-xl glow-sm hover:opacity-90 transition-opacity"
          >
            Start 7-Day Free Trial
          </button>
          <p className="text-center text-[#606070] text-sm">
            7-day free trial, then{" "}
            {selectedPlan === "annual" ? "$39.99/year" : "$4.99/month"}
            <br />
            Cancel anytime.
          </p>
          <button className="w-full text-[#3b82f6] font-medium py-3 hover:opacity-80 transition-opacity">
            Restore Purchases
          </button>
        </div>
      </div>
    </div>
  );
}
