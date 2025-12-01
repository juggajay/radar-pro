"use client";

import { useState, useEffect, useCallback } from 'react';

interface VelocityInfo {
  speed: number;
  direction: number;
  compass: string;
}

interface PredictedFrame {
  minutesAhead: number;
  url: string;
  confidence: number;
}

interface PredictiveRadarData {
  velocity: VelocityInfo;
  frames: PredictedFrame[];
  generatedAt: number;
}

interface UsePredictiveRadarResult {
  data: PredictiveRadarData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePredictiveRadar(radarId: string): UsePredictiveRadarResult {
  const [data, setData] = useState<PredictiveRadarData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPredictions = useCallback(async () => {
    if (!radarId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/radar/predict?radarId=${radarId}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch predictions');
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [radarId]);

  useEffect(() => {
    fetchPredictions();

    // Refresh every 5 minutes
    const interval = setInterval(fetchPredictions, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchPredictions]);

  return { data, isLoading, error, refetch: fetchPredictions };
}
