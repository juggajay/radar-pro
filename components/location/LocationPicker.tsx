"use client";

import { useState } from "react";
import { X, MapPin, Search } from "lucide-react";
import { RADAR_STATIONS, RadarStation, getRadarIdForRange } from "@/data/radars";

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: { name: string; radarId: string; lat: number; lng: number }) => void;
  currentLocation?: string;
}

export function LocationPicker({ isOpen, onClose, onSelect, currentLocation }: LocationPickerProps) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

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

  const handleSelect = (station: RadarStation) => {
    onSelect({
      name: station.city,
      radarId: getRadarIdForRange(station.id, 256), // Default to 256km
      lat: station.lat,
      lng: station.lng,
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
        className="relative w-full max-w-md max-h-[80vh] bg-[#12121a] rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col"
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
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search city or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#3b82f6] transition-colors"
            />
          </div>
        </div>

        {/* Location list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(stationsByState).map(([state, stations]) => (
            <div key={state}>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                {state}
              </h3>
              <div className="space-y-1">
                {stations.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => handleSelect(station)}
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

          {filteredStations.length === 0 && (
            <div className="text-center py-8 text-white/40">
              No locations found for "{search}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
