"use client";

import { Navigation, Settings, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  location?: string;
  showBack?: boolean;
  showSettings?: boolean;
  onLocationClick?: () => void;
  className?: string;
}

export function Header({
  title,
  location,
  showBack = false,
  showSettings = true,
  onLocationClick,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "relative z-10 flex items-center justify-between px-4 pt-14 pb-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {showBack && (
          <Link
            href="/"
            className="p-2 -ml-2 text-white hover:text-[#a0a0b0] transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
        )}

        {location ? (
          <button
            onClick={onLocationClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Navigation className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-lg font-semibold text-white">{location}</span>
          </button>
        ) : title ? (
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">Radar</span>
            <span className="text-lg font-bold text-[#3b82f6]">Pro</span>
          </div>
        )}
      </div>

      {showSettings && (
        <Link
          href="/settings"
          className="p-2 -mr-2 text-[#a0a0b0] hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </Link>
      )}
    </header>
  );
}
