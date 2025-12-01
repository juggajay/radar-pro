"use client";

import { useState, useEffect, useRef } from "react";
import { RangeSelector } from "./RangeSelector";
import { getRadarIdForRange, parseRadarId } from "@/data/radars";

interface RadarViewerProps {
  radarId: string;
  cityName: string;
}

export function RadarViewer({ radarId: initialRadarId, cityName }: RadarViewerProps) {
  const [range, setRange] = useState<"64" | "128" | "256" | "512">("256");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState("--");
  const [layersLoaded, setLayersLoaded] = useState({ bg: false, radar: false, locations: false });
  const [imageKey, setImageKey] = useState(0);
  const [currentTime, setCurrentTime] = useState("--:--");

  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate full radar ID with range
  const { baseId } = parseRadarId(initialRadarId);
  const radarId = getRadarIdForRange(baseId, parseInt(range) as 64 | 128 | 256 | 512);

  // Reset loading state when radar ID changes
  useEffect(() => {
    setIsLoading(true);
    setLayersLoaded({ bg: false, radar: false, locations: false });
    setImageKey(prev => prev + 1);
  }, [radarId]);

  // Check if all layers are loaded
  useEffect(() => {
    if (layersLoaded.bg && layersLoaded.radar && layersLoaded.locations) {
      setIsLoading(false);
      setLastUpdated("Just now");
      setError(null);
    }
  }, [layersLoaded]);

  // Auto-refresh radar every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setImageKey(prev => prev + 1);
      setLayersLoaded(prev => ({ ...prev, radar: false }));
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Update time on client only (avoids hydration mismatch)
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-AU", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Australia/Sydney",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle range change
  const handleRangeChange = (newRange: string) => {
    console.log("RadarViewer handleRangeChange called with:", newRange);
    console.log("Current range:", range, "-> New range:", newRange);
    setRange(newRange as "64" | "128" | "256" | "512");
  };

  const handleLayerLoad = (layer: 'bg' | 'radar' | 'locations') => {
    setLayersLoaded(prev => ({ ...prev, [layer]: true }));
  };

  const handleLayerError = (layer: string) => {
    console.error(`Failed to load ${layer} layer`);
    if (layer === 'radar') {
      setError("Unable to load radar data");
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[70vh] min-h-[500px] overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #0c1220 0%, #060a12 50%, #030508 100%)",
      }}
    >
      {/* Atmospheric background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle radar grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              radial-gradient(circle at center, transparent 0%, transparent 20%, rgba(59, 130, 246, 0.3) 20.5%, transparent 21%),
              radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(59, 130, 246, 0.2) 40.5%, transparent 41%),
              radial-gradient(circle at center, transparent 0%, transparent 60%, rgba(59, 130, 246, 0.15) 60.5%, transparent 61%),
              radial-gradient(circle at center, transparent 0%, transparent 80%, rgba(59, 130, 246, 0.1) 80.5%, transparent 81%)
            `,
            backgroundSize: "100% 100%",
          }}
        />
        {/* Radial glow from center */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.06) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Radar image container - centered with proper aspect ratio */}
      <div className="absolute inset-0 flex items-center justify-center pt-8 pointer-events-none">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            width: "min(90vw, 70vh, 580px)",
            height: "min(90vw, 70vh, 580px)",
          }}
        >
          {/* Outer glow */}
          <div
            className="absolute -inset-1 rounded-2xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(59, 130, 246, 0.15) 100%)",
              filter: "blur(10px)",
            }}
          />

          {/* Main radar container */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.6), 0 0 30px rgba(59, 130, 246, 0.1)",
            }}
          >
            {/* Background terrain layer - enhanced */}
            <img
              key={`bg-${radarId}-${imageKey}`}
              src={`/api/radar/${radarId}/layers?type=background`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{
                opacity: layersLoaded.bg ? 0.7 : 0,
                filter: "saturate(0.8) brightness(0.9) contrast(1.1)",
              }}
              onLoad={() => handleLayerLoad('bg')}
              onError={() => handleLayerError('background')}
              draggable={false}
            />

            {/* Range rings layer - subtle */}
            <img
              key={`range-${radarId}-${imageKey}`}
              src={`/api/radar/${radarId}/layers?type=range`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
              style={{ opacity: 0.2 }}
              draggable={false}
            />

            {/* BOM Animated Radar GIF - Enhanced with filters */}
            <img
              key={`radar-${radarId}-${imageKey}`}
              src={`/api/radar/${radarId}?type=current&t=${imageKey}`}
              alt="Weather Radar"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              style={{
                opacity: layersLoaded.radar ? 1 : 0,
                filter: "saturate(1.3) contrast(1.15) brightness(1.05)",
                mixBlendMode: "screen",
              }}
              onLoad={() => handleLayerLoad('radar')}
              onError={() => handleLayerError('radar')}
              draggable={false}
            />

            {/* Locations layer (city names) - enhanced visibility */}
            <img
              key={`loc-${radarId}-${imageKey}`}
              src={`/api/radar/${radarId}/layers?type=locations`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: layersLoaded.locations ? 0.9 : 0,
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
              }}
              onLoad={() => handleLayerLoad('locations')}
              onError={() => handleLayerError('locations')}
              draggable={false}
            />

            {/* Inner vignette for depth */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                boxShadow: "inset 0 0 80px rgba(0,0,0,0.4)",
              }}
            />
          </div>

          {/* Center marker with pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-full animate-ping"
                style={{
                  background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
                  animationDuration: "2s",
                }}
              />
              <div className="relative w-2.5 h-2.5 bg-blue-400 rounded-full border border-white/80 shadow-lg shadow-blue-500/50" />
            </div>
          </div>

          {/* Border */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none border border-white/10"
          />
        </div>
      </div>

      {/* Gradient fade edges - softer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#030508] via-[#030508]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#030508] via-[#030508]/50 to-transparent" />
      </div>

      {/* Range selector - top - z-50 to be above loading overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <RangeSelector value={range} onChange={handleRangeChange} />
      </div>

      {/* Time and Live indicator - below range selector */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-3 px-4 py-1.5">
          <span className="text-white/70 text-sm font-medium tabular-nums">
            {currentTime}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              Live
            </span>
          </span>
        </div>
      </div>

      {/* City label - bottom right */}
      <div className="absolute bottom-5 right-5 z-20 text-right">
        <div className="text-white/90 text-base font-semibold tracking-wide">{cityName}</div>
        <div className="text-white/40 text-[10px] mt-0.5 tracking-wide">
          Bureau of Meteorology
        </div>
      </div>

      {/* Rain intensity legend - redesigned */}
      <div className="absolute bottom-5 left-5 z-20">
        <div
          className="px-3 py-2 rounded-lg border border-white/10 backdrop-blur-sm"
          style={{
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="text-white/50 text-[9px] uppercase tracking-wider mb-1.5 font-medium">Rain Intensity</div>
          <div className="flex gap-0.5">
            <div className="w-5 h-2 rounded-l-sm" style={{ background: '#00C853' }} />
            <div className="w-5 h-2" style={{ background: '#FFEB3B' }} />
            <div className="w-5 h-2" style={{ background: '#FF9800' }} />
            <div className="w-5 h-2" style={{ background: '#F44336' }} />
            <div className="w-5 h-2 rounded-r-sm" style={{ background: '#9C27B0' }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-white/40 text-[8px]">Light</span>
            <span className="text-white/40 text-[8px]">Heavy</span>
          </div>
        </div>
      </div>

      {/* Update indicator - bottom center */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
        <span className="text-white/40 text-xs">
          Updated {lastUpdated}
        </span>
      </div>

      {/* Loading state - enhanced */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#030508] z-30">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto">
              {/* Outer ring */}
              <div className="absolute inset-0 border border-blue-500/20 rounded-full" />
              {/* Spinning ring */}
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  border: "2px solid transparent",
                  borderTopColor: "rgba(59, 130, 246, 0.8)",
                  animationDuration: "1s",
                }}
              />
              {/* Inner spinning ring */}
              <div
                className="absolute inset-3 rounded-full animate-spin"
                style={{
                  border: "2px solid transparent",
                  borderTopColor: "rgba(59, 130, 246, 0.4)",
                  animationDuration: "1.5s",
                  animationDirection: "reverse",
                }}
              />
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              </div>
            </div>
            <p className="text-white/50 text-sm mt-4 tracking-wide">Loading radar...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#030508]/95 z-30">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-white/70 text-sm font-medium">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setImageKey(prev => prev + 1);
                setIsLoading(true);
                setLayersLoaded({ bg: false, radar: false, locations: false });
              }}
              className="mt-4 px-4 py-2 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors rounded-lg border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
