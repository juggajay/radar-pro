"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radar, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "radar", label: "Radar", icon: Radar, href: "/" },
  { id: "forecast", label: "Forecast", icon: Calendar, href: "/forecast" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === "/" || pathname.startsWith("/radar")) return "radar";
    if (pathname.startsWith("/forecast")) return "forecast";
    if (pathname.startsWith("/settings")) return "settings";
    return "radar";
  };

  const activeTab = getActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-[#0a0a0f]/90 backdrop-blur-xl border-t border-white/10">
        <div className="flex justify-around items-center h-16 pb-safe max-w-lg mx-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-6 py-2 transition-colors relative",
                  isActive ? "text-[#3b82f6]" : "text-[#606070]"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#3b82f6] rounded-full glow-accent" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
