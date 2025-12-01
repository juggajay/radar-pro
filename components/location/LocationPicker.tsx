"use client";

import { useState, useEffect, useCallback } from "react";
import { X, MapPin, Search, Loader2, Navigation } from "lucide-react";
import { RADAR_STATIONS, RadarStation, getRadarIdForRange, getRadarForLocation } from "@/data/radars";

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: { name: string; radarId: string; lat: number; lng: number }) => void;
  currentLocation?: string;
}

interface GeocodedLocation {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  state: string;
  postcode: string;
  type: string;
}

export function LocationPicker({ isOpen, onClose, onSelect, currentLocation }: LocationPickerProps) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showStations, setShowStations] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Debounced search for suburbs
  useEffect(() => {
    if (search.length < 3) {
      setSearchResults([]);
      setShowStations(true);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setShowStations(false);
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(search)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearestRadar = getRadarForLocation(latitude, longitude);

        if (nearestRadar) {
          onSelect({
            name: "Current Location",
            radarId: getRadarIdForRange(nearestRadar.id, 256),
            lat: latitude,
            lng: longitude,
          });
          onClose();
        }
        setGettingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to get your location. Please enable location services.");
        setGettingLocation(false);
      }
    );
  }, [onSelect, onClose]);

  if (!isOpen) return null;

  // Filter radar stations based on search
  const filteredStations = RADAR_STATIONS.filter(
    (station) =>
      station.city.toLowerCase().includes(search.toLowerCase()) ||
      station.name.toLowerCase().includes(search.toLowerCase()) ||
      station.state.toLowerCase().includes(search.toLowerCase())
  );

  // Group by state
  const stationsByState = filteredStations.reduce((acc, station) => {
    if (!acc[station.state]) {
      acc[station.state] = [];
    }
    acc[station.state].push(station);
    return acc;
  }, {} as Record<string, RadarStation[]>);

  const handleSelectStation = (station: RadarStation) => {
    onSelect({
      name: station.city,
      radarId: getRadarIdForRange(station.id, 256),
      lat: station.lat,
      lng: station.lng,
    });
    onClose();
  };

  const handleSelectSuburb = (location: GeocodedLocation) => {
    const nearestRadar = getRadarForLocation(location.lat, location.lng);

    if (!nearestRadar) {
      alert("No radar coverage for this location");
      return;
    }

    onSelect({
      name: location.name,
      radarId: getRadarIdForRange(nearestRadar.id, 256),
      lat: location.lat,
      lng: location.lng,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md max-h-[85vh] bg-[#12121a] rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{
          boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Select Location</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search suburb, city or postcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#3b82f6] transition-colors"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 animate-spin" />
            )}
          </div>

          {/* Use current location button */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={gettingLocation}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#3b82f6]/20 border border-[#3b82f6]/30 rounded-xl text-[#3b82f6] font-medium hover:bg-[#3b82f6]/30 transition-colors disabled:opacity-50"
          >
            {gettingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            {gettingLocation ? "Getting location..." : "Use Current Location"}
          </button>
        </div>

        {/* Location list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Search results for suburbs */}
          {!showStations && searchResults.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Search Results
              </h3>
              <div className="space-y-1">
                {searchResults.map((location, index) => (
                  <button
                    key={`${location.lat}-${location.lng}-${index}`}
                    onClick={() => handleSelectSuburb(location)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                    <div className="text-left min-w-0">
                      <div className="font-medium text-white truncate">
                        {location.name}
                        {location.postcode && (
                          <span className="text-white/40 ml-2">{location.postcode}</span>
                        )}
                      </div>
                      <div className="text-xs text-white/40 truncate">
                        {location.displayName}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No search results */}
          {!showStations && !isSearching && searchResults.length === 0 && search.length >= 3 && (
            <div className="text-center py-8 text-white/40">
              No locations found for "{search}"
            </div>
          )}

          {/* Radar stations list */}
          {showStations && (
            <>
              <div className="text-xs text-white/40 mb-2">
                Or select a radar station:
              </div>
              {Object.entries(stationsByState).map(([state, stations]) => (
                <div key={state}>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                    {state}
                  </h3>
                  <div className="space-y-1">
                    {stations.map((station) => (
                      <button
                        key={station.id}
                        onClick={() => handleSelectStation(station)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          currentLocation === station.city
                            ? "bg-[#3b82f6]/20 border border-[#3b82f6]/50"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <MapPin
                          className={`w-4 h-4 ${
                            currentLocation === station.city
                              ? "text-[#3b82f6]"
                              : "text-white/40"
                          }`}
                        />
                        <div className="text-left">
                          <div
                            className={`font-medium ${
                              currentLocation === station.city
                                ? "text-[#3b82f6]"
                                : "text-white"
                            }`}
                          >
                            {station.city}
                          </div>
                          <div className="text-xs text-white/40">{station.name} Radar</div>
                        </div>
                        {currentLocation === station.city && (
                          <div className="ml-auto text-xs text-[#3b82f6]">Current</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
