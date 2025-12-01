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

  // Handle range change
  const handleRangeChange = (newRange: string) => {
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

  // Get current time for display
  const currentTime = new Date().toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Australia/Sydney",
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[65vh] min-h-[450px] overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050508 0%, #0a0a12 50%, #0d0d18 100%)",
      }}
    >
      {/* Atmospheric background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100, 150, 255, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100, 150, 255, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Radial glow from center */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.08) 0%, transparent 60%)",
          }}
        />
        {/* Corner vignettes */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at top left, rgba(0,0,0,0.4) 0%, transparent 50%),
              radial-gradient(ellipse at top right, rgba(0,0,0,0.4) 0%, transparent 50%),
              radial-gradient(ellipse at bottom left, rgba(0,0,0,0.5) 0%, transparent 50%),
              radial-gradient(ellipse at bottom right, rgba(0,0,0,0.5) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Radar image container - centered with proper aspect ratio */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative"
          style={{
            width: "min(90vw, 70vh, 600px)",
            height: "min(90vw, 70vh, 600px)",
          }}
        >
          {/* Background terrain layer */}
          <img
            key={`bg-${radarId}-${imageKey}`}
            src={`/api/radar/${radarId}/layers?type=background`}
            alt=""
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
            style={{ opacity: layersLoaded.bg ? 0.85 : 0 }}
            onLoad={() => handleLayerLoad('bg')}
            onError={() => handleLayerError('background')}
            draggable={false}
          />

          {/* Range rings layer */}
          <img
            key={`range-${radarId}-${imageKey}`}
            src={`/api/radar/${radarId}/layers?type=range`}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
            style={{ opacity: 0.3 }}
            draggable={false}
          />

          {/* BOM Animated Radar GIF - The main radar display */}
          <img
            key={`radar-${radarId}-${imageKey}`}
            src={`/api/radar/${radarId}?type=current&t=${imageKey}`}
            alt="Weather Radar"
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
            style={{
              opacity: layersLoaded.radar ? 0.95 : 0,
            }}
            onLoad={() => handleLayerLoad('radar')}
            onError={() => handleLayerError('radar')}
            draggable={false}
          />

          {/* Locations layer (city names) */}
          <img
            key={`loc-${radarId}-${imageKey}`}
            src={`/api/radar/${radarId}/layers?type=locations`}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
            style={{ opacity: layersLoaded.locations ? 0.95 : 0 }}
            onLoad={() => handleLayerLoad('locations')}
            onError={() => handleLayerError('locations')}
            draggable={false}
          />

          {/* Center marker with pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              <div className="absolute -inset-3 bg-blue-500/30 rounded-full animate-ping" />
              <div className="absolute -inset-1.5 bg-blue-500/20 rounded-full animate-pulse" />
              <div className="relative w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg shadow-blue-500/50" />
            </div>
          </div>

          {/* Circular frame/border */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: `
                inset 0 0 80px rgba(0,0,0,0.6),
                0 0 40px rgba(59, 130, 246, 0.1)
              `,
            }}
          />
        </div>
      </div>

      {/* Gradient fade edges */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#050508] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d0d18] to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#050508]/80 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#050508]/80 to-transparent" />
      </div>

      {/* Time indicator badge */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
        <div
          className="px-5 py-2 rounded-full border border-white/10 backdrop-blur-md"
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(20,20,30,0.7) 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-white/90 text-sm font-medium tracking-wide">
              {currentTime}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                Live
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Range selector */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <RangeSelector value={range} onChange={handleRangeChange} />
      </div>

      {/* City label and attribution */}
      <div className="absolute bottom-6 right-6 z-20 text-right">
        <div className="text-white/80 text-sm font-medium tracking-wide">{cityName}</div>
        <div className="text-white/30 text-[10px] mt-1 tracking-wide">
          Data: Bureau of Meteorology
        </div>
      </div>

      {/* Rain intensity legend */}
      <div className="absolute bottom-6 left-6 z-20">
        <div
          className="px-3 py-2.5 rounded-xl border border-white/10 backdrop-blur-md"
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(20,20,30,0.6) 100%)",
          }}
        >
          <div className="text-white/40 text-[9px] uppercase tracking-wider mb-2">Intensity</div>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-sm" style={{ background: 'linear-gradient(135deg, #90EE90, #00AA00)' }} title="Light" />
            <div className="w-4 h-4 rounded-sm" style={{ background: 'linear-gradient(135deg, #FFFF00, #FFD700)' }} title="Moderate" />
            <div className="w-4 h-4 rounded-sm" style={{ background: 'linear-gradient(135deg, #FFA500, #FF6600)' }} title="Heavy" />
            <div className="w-4 h-4 rounded-sm" style={{ background: 'linear-gradient(135deg, #FF4444, #CC0000)' }} title="Intense" />
            <div className="w-4 h-4 rounded-sm" style={{ background: 'linear-gradient(135deg, #FF00FF, #8B008B)' }} title="Extreme" />
          </div>
        </div>
      </div>

      {/* Update indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div
          className="px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(20,20,30,0.6) 100%)",
          }}
        >
          <span className="text-white/50 text-xs">
            Updated {lastUpdated}
          </span>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050508] z-30">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 rounded-full animate-spin" />
              <div
                className="absolute inset-2 border-2 border-transparent border-t-blue-400/50 rounded-full animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
              />
            </div>
            <p className="text-white/40 text-sm mt-4 tracking-wide">Loading radar...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050508]/95 z-30">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-white/60 text-sm">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setImageKey(prev => prev + 1);
                setIsLoading(true);
                setLayersLoaded({ bg: false, radar: false, locations: false });
              }}
              className="mt-4 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
