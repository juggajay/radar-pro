"use client";

import { X, AlertTriangle, Home, Lock, Car, Radio } from "lucide-react";
import { GlassCard } from "@/components/layout";

interface SevereWeatherAlertProps {
  isOpen: boolean;
  onClose: () => void;
  alert: {
    type: string;
    issuedAt: string;
    expiresAt: string;
    affectedAreas: string[];
    details: string;
  };
}

const recommendedActions = [
  { icon: Home, text: "Move indoors and away from windows" },
  { icon: Lock, text: "Secure loose outdoor items" },
  { icon: Car, text: "Avoid driving if possible" },
  { icon: Radio, text: "Stay informed via radio or official sources" },
];

export function SevereWeatherAlert({
  isOpen,
  onClose,
  alert,
}: SevereWeatherAlertProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <GlassCard
        className="w-full max-w-md max-h-[90vh] overflow-y-auto"
        padding="none"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div />
          <span className="text-white font-semibold">Weather Alert</span>
          <button
            onClick={onClose}
            className="p-1 text-[#a0a0b0] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert header with gradient */}
        <div className="bg-gradient-to-br from-[#f59e0b]/30 to-[#ef4444]/20 p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#f59e0b] rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">
                {alert.type.toUpperCase()}
              </h2>
              <div className="text-[#a0a0b0] text-sm mt-1">
                <div>Issued: {alert.issuedAt}</div>
                <div>Expires: {alert.expiresAt}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Affected areas */}
          <div>
            <h3 className="text-[#606070] text-xs font-medium uppercase tracking-wider mb-2">
              Affected Areas
            </h3>
            <p className="text-white">{alert.affectedAreas.join(", ")}</p>
          </div>

          {/* Details */}
          <div>
            <h3 className="text-[#606070] text-xs font-medium uppercase tracking-wider mb-2">
              Details
            </h3>
            <p className="text-[#a0a0b0] text-sm leading-relaxed">
              {alert.details}
            </p>
          </div>

          {/* Recommended actions */}
          <div>
            <h3 className="text-[#606070] text-xs font-medium uppercase tracking-wider mb-3">
              Recommended Actions
            </h3>
            <div className="space-y-3">
              {recommendedActions.map((action, index) => (
                <div key={index} className="flex items-center gap-3">
                  <action.icon className="w-5 h-5 text-[#a0a0b0] flex-shrink-0" />
                  <span className="text-white text-sm">{action.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
          >
            View on Radar
          </button>

          {/* Source */}
          <p className="text-center text-[#606070] text-xs">
            Source: Bureau of Meteorology
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
