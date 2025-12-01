"use client";

import { useState } from "react";
import { Header, BottomNav } from "@/components/layout";
import { RadarViewer } from "@/components/radar";
import { CurrentConditions } from "@/components/weather";
import { LocationPicker } from "@/components/location";

export default function HomePage() {
  const [location, setLocation] = useState({
    name: "Sydney",
    radarId: "IDR713",
    lat: -33.8688,
    lng: 151.2093,
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Mock weather data - would come from BOM API
  const weatherData = {
    temperature: 23,
    feelsLike: 25,
    condition: "Partly Cloudy",
    humidity: 65,
    wind: "12km/h NE",
    uvIndex: 6,
    radarId: location.radarId,
    lat: location.lat,
    lng: location.lng,
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header with location */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <Header
          location={location.name}
          onLocationClick={() => setShowLocationPicker(true)}
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

      {/* Location picker modal */}
      <LocationPicker
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelect={(newLocation) => setLocation(newLocation)}
        currentLocation={location.name}
      />
    </div>
  );
}
