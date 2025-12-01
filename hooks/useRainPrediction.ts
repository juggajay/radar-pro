"use client";

import { useState, useEffect } from "react";

export interface RainPrediction {
  willRain: boolean;
  minutesUntil: number | null;
  intensity: "light" | "moderate" | "heavy" | null;
  direction: string;
  confidence: number;
  radar?: {
    id: string;
    station: string;
    city: string;
    range: number;
  };
}

interface UseRainPredictionOptions {
  lat?: number;
  lng?: number;
  radarId?: string;
  refreshInterval?: number; // ms, default 5 minutes
}

export function useRainPrediction(options: UseRainPredictionOptions = {}) {
  const {
    lat = -33.8688, // Default to Sydney
    lng = 151.2093,
    radarId,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [prediction, setPrediction] = useState<RainPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPrediction() {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          lat: lat.toString(),
          lng: lng.toString(),
        });

        if (radarId) {
          params.set("radarId", radarId);
        }

        const response = await fetch(`/api/predict?${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch prediction");
        }

        const data = await response.json();

        if (isMounted) {
          setPrediction(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setPrediction(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPrediction();

    // Set up refresh interval
    const interval = setInterval(fetchPrediction, refreshInterval);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [lat, lng, radarId, refreshInterval]);

  return { prediction, isLoading, error, refetch: () => {} };
}
