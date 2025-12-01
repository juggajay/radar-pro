// Australian BOM Radar Stations
// Each station has a base ID and supports multiple range options

export interface RadarStation {
  id: string           // Base radar ID (e.g., IDR71 for Sydney)
  name: string         // Station name
  city: string         // Primary city
  state: string        // State abbreviation
  lat: number          // Latitude
  lng: number          // Longitude
  ranges: RadarRange[] // Available range options
}

export interface RadarRange {
  km: 64 | 128 | 256 | 512
  radarId: string      // Full radar ID with range suffix
}

// Range suffix mapping
// 1 = 64km, 2 = 128km, 3 = 256km, 4 = 512km
function createRanges(baseId: string, available: (64 | 128 | 256 | 512)[] = [64, 128, 256, 512]): RadarRange[] {
  const suffixMap: Record<number, string> = { 64: '1', 128: '2', 256: '3', 512: '4' }
  return available.map(km => ({
    km,
    radarId: `${baseId}${suffixMap[km]}`
  }))
}

export const RADAR_STATIONS: RadarStation[] = [
  // NSW
  {
    id: 'IDR71',
    name: 'Terrey Hills',
    city: 'Sydney',
    state: 'NSW',
    lat: -33.701,
    lng: 151.210,
    ranges: createRanges('IDR71'),
  },
  {
    id: 'IDR04',
    name: 'Williamtown',
    city: 'Newcastle',
    state: 'NSW',
    lat: -32.790,
    lng: 151.833,
    ranges: createRanges('IDR04'),
  },
  {
    id: 'IDR03',
    name: 'Wollongong',
    city: 'Wollongong',
    state: 'NSW',
    lat: -34.263,
    lng: 150.875,
    ranges: createRanges('IDR03'),
  },
  {
    id: 'IDR40',
    name: 'Canberra',
    city: 'Canberra',
    state: 'ACT',
    lat: -35.662,
    lng: 149.512,
    ranges: createRanges('IDR40'),
  },
  {
    id: 'IDR28',
    name: 'Grafton',
    city: 'Coffs Harbour',
    state: 'NSW',
    lat: -29.622,
    lng: 152.951,
    ranges: createRanges('IDR28'),
  },

  // VIC
  {
    id: 'IDR02',
    name: 'Melbourne',
    city: 'Melbourne',
    state: 'VIC',
    lat: -37.856,
    lng: 144.756,
    ranges: createRanges('IDR02'),
  },

  // QLD
  {
    id: 'IDR66',
    name: 'Marburg',
    city: 'Brisbane',
    state: 'QLD',
    lat: -27.608,
    lng: 152.540,
    ranges: createRanges('IDR66'),
  },
  {
    id: 'IDR50',
    name: 'Marburg',
    city: 'Gold Coast',
    state: 'QLD',
    lat: -27.608,
    lng: 152.540,
    ranges: createRanges('IDR50'),
  },
  {
    id: 'IDR94',
    name: 'Gympie',
    city: 'Sunshine Coast',
    state: 'QLD',
    lat: -26.258,
    lng: 152.577,
    ranges: createRanges('IDR94'),
  },
  {
    id: 'IDR73',
    name: 'Townsville',
    city: 'Townsville',
    state: 'QLD',
    lat: -19.420,
    lng: 146.550,
    ranges: createRanges('IDR73'),
  },
  {
    id: 'IDR08',
    name: 'Cairns',
    city: 'Cairns',
    state: 'QLD',
    lat: -16.818,
    lng: 145.683,
    ranges: createRanges('IDR08'),
  },

  // WA
  {
    id: 'IDR70',
    name: 'Perth',
    city: 'Perth',
    state: 'WA',
    lat: -32.392,
    lng: 115.867,
    ranges: createRanges('IDR70'),
  },

  // SA
  {
    id: 'IDR64',
    name: 'Adelaide',
    city: 'Adelaide',
    state: 'SA',
    lat: -34.617,
    lng: 138.469,
    ranges: createRanges('IDR64'),
  },

  // TAS
  {
    id: 'IDR76',
    name: 'Hobart',
    city: 'Hobart',
    state: 'TAS',
    lat: -43.112,
    lng: 147.806,
    ranges: createRanges('IDR76'),
  },
  {
    id: 'IDR52',
    name: 'West Takone',
    city: 'Launceston',
    state: 'TAS',
    lat: -41.181,
    lng: 145.579,
    ranges: createRanges('IDR52'),
  },

  // NT
  {
    id: 'IDR63',
    name: 'Darwin',
    city: 'Darwin',
    state: 'NT',
    lat: -12.457,
    lng: 130.926,
    ranges: createRanges('IDR63'),
  },
  {
    id: 'IDR25',
    name: 'Alice Springs',
    city: 'Alice Springs',
    state: 'NT',
    lat: -23.796,
    lng: 133.889,
    ranges: createRanges('IDR25'),
  },
]

// Get station by base ID
export function getStationById(id: string): RadarStation | undefined {
  return RADAR_STATIONS.find(s => s.id === id)
}

// Get station by city name
export function getStationByCity(city: string): RadarStation | undefined {
  return RADAR_STATIONS.find(s => s.city.toLowerCase() === city.toLowerCase())
}

// Get radar ID for a specific range
export function getRadarIdForRange(baseId: string, rangeKm: 64 | 128 | 256 | 512): string {
  const suffixMap: Record<number, string> = { 64: '1', 128: '2', 256: '3', 512: '4' }
  // Handle both IDR71 (5 char) and IDR713 (6 char) formats
  const base = baseId.length === 6 ? baseId.slice(0, 5) : baseId
  return `${base}${suffixMap[rangeKm]}`
}

// Parse a full radar ID to get base and range
export function parseRadarId(radarId: string): { baseId: string; rangeKm: 64 | 128 | 256 | 512 } {
  const rangeMap: Record<string, 64 | 128 | 256 | 512> = {
    '1': 64,
    '2': 128,
    '3': 256,
    '4': 512,
  }

  if (radarId.length === 6) {
    const baseId = radarId.slice(0, 5)
    const rangeSuffix = radarId.slice(5)
    return {
      baseId,
      rangeKm: rangeMap[rangeSuffix] || 256
    }
  }

  // Default to 256km if no range suffix
  return { baseId: radarId, rangeKm: 256 }
}

// Default range for initial display
export const DEFAULT_RANGE: 64 | 128 | 256 | 512 = 256

// Get the nearest radar station to a given location
export function getRadarForLocation(lat: number, lng: number): RadarStation {
  let nearest: RadarStation | null = null
  let minDistance = Infinity

  for (const station of RADAR_STATIONS) {
    // Simple Euclidean distance (good enough for Australia)
    const dLat = lat - station.lat
    const dLng = lng - station.lng
    const distance = Math.sqrt(dLat * dLat + dLng * dLng)

    if (distance < minDistance) {
      minDistance = distance
      nearest = station
    }
  }

  // Default to Sydney if somehow no match
  return nearest || RADAR_STATIONS[0]
}

// Get radar station by full radar ID (e.g., IDR713)
export function getStationByRadarId(radarId: string): RadarStation | undefined {
  const { baseId } = parseRadarId(radarId)
  return RADAR_STATIONS.find(s => s.id === baseId)
}
