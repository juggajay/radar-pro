"use client";

import { useState } from "react";
import { Header, BottomNav } from "@/components/layout";
import { RadarViewer } from "@/components/radar";
import { CurrentConditions } from "@/components/weather";

export default function HomePage() {
  const [location] = useState({
    name: "Sydney",
    radarId: "IDR713",
  });

  // Mock weather data - would come from BOM API
  const weatherData = {
    temperature: 23,
    feelsLike: 25,
    condition: "Partly Cloudy",
    humidity: 65,
    wind: "12km/h NE",
    uvIndex: 6,
    radarId: location.radarId,
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header with location */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <Header
          location={location.name}
          onLocationClick={() => {
            // TODO: Open location picker modal
            console.log("Open location picker");
          }}
        />
      </div>

      {/* Radar viewer */}
      <RadarViewer radarId={location.radarId} cityName={location.name} />

      {/* Current conditions card */}
      <div className="-mt-8 relative z-20">
        <CurrentConditions {...weatherData} />
      </div>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
