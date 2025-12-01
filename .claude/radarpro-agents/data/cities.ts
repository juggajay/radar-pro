// data/cities.ts
// Australian cities for SEO pages and location search

export interface City {
  slug: string
  name: string
  state: string
  stateCode: string
  lat: number
  lng: number
  population: number // For priority sorting
  radarId: string // Nearest radar station
}

export const CITIES: City[] = [
  // NSW
  { slug: 'sydney', name: 'Sydney', state: 'New South Wales', stateCode: 'NSW', lat: -33.8688, lng: 151.2093, population: 5312000, radarId: 'IDR713' },
  { slug: 'newcastle', name: 'Newcastle', state: 'New South Wales', stateCode: 'NSW', lat: -32.9283, lng: 151.7817, population: 322000, radarId: 'IDR043' },
  { slug: 'wollongong', name: 'Wollongong', state: 'New South Wales', stateCode: 'NSW', lat: -34.4278, lng: 150.8931, population: 302000, radarId: 'IDR033' },
  { slug: 'central-coast', name: 'Central Coast', state: 'New South Wales', stateCode: 'NSW', lat: -33.4245, lng: 151.3416, population: 333000, radarId: 'IDR713' },
  { slug: 'wagga-wagga', name: 'Wagga Wagga', state: 'New South Wales', stateCode: 'NSW', lat: -35.1082, lng: 147.3598, population: 67000, radarId: 'IDR403' },
  { slug: 'albury', name: 'Albury', state: 'New South Wales', stateCode: 'NSW', lat: -36.0737, lng: 146.9135, population: 54000, radarId: 'IDR493' },
  { slug: 'tamworth', name: 'Tamworth', state: 'New South Wales', stateCode: 'NSW', lat: -31.0927, lng: 150.9320, population: 42000, radarId: 'IDR283' },
  { slug: 'orange', name: 'Orange', state: 'New South Wales', stateCode: 'NSW', lat: -33.2833, lng: 149.1000, population: 42000, radarId: 'IDR713' },
  { slug: 'dubbo', name: 'Dubbo', state: 'New South Wales', stateCode: 'NSW', lat: -32.2427, lng: 148.6015, population: 38000, radarId: 'IDR713' },
  { slug: 'bathurst', name: 'Bathurst', state: 'New South Wales', stateCode: 'NSW', lat: -33.4167, lng: 149.5833, population: 37000, radarId: 'IDR713' },
  { slug: 'nowra', name: 'Nowra', state: 'New South Wales', stateCode: 'NSW', lat: -34.8833, lng: 150.6000, population: 35000, radarId: 'IDR033' },
  { slug: 'coffs-harbour', name: 'Coffs Harbour', state: 'New South Wales', stateCode: 'NSW', lat: -30.2963, lng: 153.1157, population: 73000, radarId: 'IDR283' },
  { slug: 'port-macquarie', name: 'Port Macquarie', state: 'New South Wales', stateCode: 'NSW', lat: -31.4333, lng: 152.9000, population: 49000, radarId: 'IDR283' },
  { slug: 'lismore', name: 'Lismore', state: 'New South Wales', stateCode: 'NSW', lat: -28.8167, lng: 153.2833, population: 28000, radarId: 'IDR283' },
  { slug: 'armidale', name: 'Armidale', state: 'New South Wales', stateCode: 'NSW', lat: -30.5000, lng: 151.6667, population: 25000, radarId: 'IDR283' },
  
  // VIC
  { slug: 'melbourne', name: 'Melbourne', state: 'Victoria', stateCode: 'VIC', lat: -37.8136, lng: 144.9631, population: 5078000, radarId: 'IDR023' },
  { slug: 'geelong', name: 'Geelong', state: 'Victoria', stateCode: 'VIC', lat: -38.1499, lng: 144.3617, population: 270000, radarId: 'IDR023' },
  { slug: 'ballarat', name: 'Ballarat', state: 'Victoria', stateCode: 'VIC', lat: -37.5622, lng: 143.8503, population: 111000, radarId: 'IDR023' },
  { slug: 'bendigo', name: 'Bendigo', state: 'Victoria', stateCode: 'VIC', lat: -36.7570, lng: 144.2794, population: 100000, radarId: 'IDR023' },
  { slug: 'shepparton', name: 'Shepparton', state: 'Victoria', stateCode: 'VIC', lat: -36.3833, lng: 145.4000, population: 52000, radarId: 'IDR493' },
  { slug: 'mildura', name: 'Mildura', state: 'Victoria', stateCode: 'VIC', lat: -34.1833, lng: 142.1500, population: 34000, radarId: 'IDR683' },
  { slug: 'warrnambool', name: 'Warrnambool', state: 'Victoria', stateCode: 'VIC', lat: -38.3833, lng: 142.4833, population: 34000, radarId: 'IDR023' },
  { slug: 'wodonga', name: 'Wodonga', state: 'Victoria', stateCode: 'VIC', lat: -36.1167, lng: 146.8833, population: 42000, radarId: 'IDR493' },
  { slug: 'traralgon', name: 'Traralgon', state: 'Victoria', stateCode: 'VIC', lat: -38.1958, lng: 146.5403, population: 28000, radarId: 'IDR023' },
  
  // QLD
  { slug: 'brisbane', name: 'Brisbane', state: 'Queensland', stateCode: 'QLD', lat: -27.4698, lng: 153.0251, population: 2514000, radarId: 'IDR663' },
  { slug: 'gold-coast', name: 'Gold Coast', state: 'Queensland', stateCode: 'QLD', lat: -28.0167, lng: 153.4000, population: 679000, radarId: 'IDR503' },
  { slug: 'sunshine-coast', name: 'Sunshine Coast', state: 'Queensland', stateCode: 'QLD', lat: -26.6500, lng: 153.0667, population: 351000, radarId: 'IDR943' },
  { slug: 'townsville', name: 'Townsville', state: 'Queensland', stateCode: 'QLD', lat: -19.2500, lng: 146.8167, population: 180000, radarId: 'IDR733' },
  { slug: 'cairns', name: 'Cairns', state: 'Queensland', stateCode: 'QLD', lat: -16.9186, lng: 145.7781, population: 153000, radarId: 'IDR083' },
  { slug: 'toowoomba', name: 'Toowoomba', state: 'Queensland', stateCode: 'QLD', lat: -27.5667, lng: 151.9500, population: 136000, radarId: 'IDR663' },
  { slug: 'mackay', name: 'Mackay', state: 'Queensland', stateCode: 'QLD', lat: -21.1500, lng: 149.2000, population: 80000, radarId: 'IDR223' },
  { slug: 'rockhampton', name: 'Rockhampton', state: 'Queensland', stateCode: 'QLD', lat: -23.3833, lng: 150.5000, population: 79000, radarId: 'IDR783' },
  { slug: 'bundaberg', name: 'Bundaberg', state: 'Queensland', stateCode: 'QLD', lat: -24.8667, lng: 152.3500, population: 52000, radarId: 'IDR783' },
  { slug: 'hervey-bay', name: 'Hervey Bay', state: 'Queensland', stateCode: 'QLD', lat: -25.2833, lng: 152.8500, population: 55000, radarId: 'IDR943' },
  { slug: 'gladstone', name: 'Gladstone', state: 'Queensland', stateCode: 'QLD', lat: -23.8500, lng: 151.2500, population: 34000, radarId: 'IDR783' },
  { slug: 'mount-isa', name: 'Mount Isa', state: 'Queensland', stateCode: 'QLD', lat: -20.7256, lng: 139.4927, population: 18000, radarId: 'IDR733' },
  
  // WA
  { slug: 'perth', name: 'Perth', state: 'Western Australia', stateCode: 'WA', lat: -31.9505, lng: 115.8605, population: 2085000, radarId: 'IDR703' },
  { slug: 'mandurah', name: 'Mandurah', state: 'Western Australia', stateCode: 'WA', lat: -32.5269, lng: 115.7217, population: 98000, radarId: 'IDR703' },
  { slug: 'bunbury', name: 'Bunbury', state: 'Western Australia', stateCode: 'WA', lat: -33.3333, lng: 115.6333, population: 75000, radarId: 'IDR703' },
  { slug: 'geraldton', name: 'Geraldton', state: 'Western Australia', stateCode: 'WA', lat: -28.7667, lng: 114.6000, population: 39000, radarId: 'IDR173' },
  { slug: 'kalgoorlie', name: 'Kalgoorlie', state: 'Western Australia', stateCode: 'WA', lat: -30.7500, lng: 121.4667, population: 30000, radarId: 'IDR153' },
  { slug: 'albany', name: 'Albany', state: 'Western Australia', stateCode: 'WA', lat: -35.0269, lng: 117.8836, population: 36000, radarId: 'IDR063' },
  { slug: 'broome', name: 'Broome', state: 'Western Australia', stateCode: 'WA', lat: -17.9614, lng: 122.2359, population: 16000, radarId: 'IDR183' },
  { slug: 'karratha', name: 'Karratha', state: 'Western Australia', stateCode: 'WA', lat: -20.7364, lng: 116.8464, population: 17000, radarId: 'IDR183' },
  
  // SA
  { slug: 'adelaide', name: 'Adelaide', state: 'South Australia', stateCode: 'SA', lat: -34.9285, lng: 138.6007, population: 1376000, radarId: 'IDR643' },
  { slug: 'mount-gambier', name: 'Mount Gambier', state: 'South Australia', stateCode: 'SA', lat: -37.8333, lng: 140.7833, population: 29000, radarId: 'IDR643' },
  { slug: 'whyalla', name: 'Whyalla', state: 'South Australia', stateCode: 'SA', lat: -33.0333, lng: 137.5333, population: 21000, radarId: 'IDR463' },
  { slug: 'port-lincoln', name: 'Port Lincoln', state: 'South Australia', stateCode: 'SA', lat: -34.7333, lng: 135.8667, population: 17000, radarId: 'IDR643' },
  { slug: 'port-augusta', name: 'Port Augusta', state: 'South Australia', stateCode: 'SA', lat: -32.4833, lng: 137.7833, population: 14000, radarId: 'IDR463' },
  { slug: 'murray-bridge', name: 'Murray Bridge', state: 'South Australia', stateCode: 'SA', lat: -35.1167, lng: 139.2667, population: 22000, radarId: 'IDR643' },
  
  // TAS
  { slug: 'hobart', name: 'Hobart', state: 'Tasmania', stateCode: 'TAS', lat: -42.8821, lng: 147.3272, population: 238000, radarId: 'IDR763' },
  { slug: 'launceston', name: 'Launceston', state: 'Tasmania', stateCode: 'TAS', lat: -41.4333, lng: 147.1333, population: 90000, radarId: 'IDR523' },
  { slug: 'devonport', name: 'Devonport', state: 'Tasmania', stateCode: 'TAS', lat: -41.1833, lng: 146.3500, population: 30000, radarId: 'IDR523' },
  { slug: 'burnie', name: 'Burnie', state: 'Tasmania', stateCode: 'TAS', lat: -41.0667, lng: 145.9167, population: 20000, radarId: 'IDR523' },
  
  // NT
  { slug: 'darwin', name: 'Darwin', state: 'Northern Territory', stateCode: 'NT', lat: -12.4634, lng: 130.8456, population: 147000, radarId: 'IDR633' },
  { slug: 'alice-springs', name: 'Alice Springs', state: 'Northern Territory', stateCode: 'NT', lat: -23.6980, lng: 133.8807, population: 26000, radarId: 'IDR253' },
  { slug: 'katherine', name: 'Katherine', state: 'Northern Territory', stateCode: 'NT', lat: -14.4667, lng: 132.2667, population: 6000, radarId: 'IDR633' },
  
  // ACT
  { slug: 'canberra', name: 'Canberra', state: 'Australian Capital Territory', stateCode: 'ACT', lat: -35.2809, lng: 149.1300, population: 457000, radarId: 'IDR403' },
]

// Get cities sorted by population (most popular first)
export const CITIES_BY_POPULATION = [...CITIES].sort((a, b) => b.population - a.population)

// Get cities grouped by state
export const CITIES_BY_STATE = CITIES.reduce((acc, city) => {
  if (!acc[city.state]) {
    acc[city.state] = []
  }
  acc[city.state].push(city)
  return acc
}, {} as Record<string, City[]>)

// Find city by slug
export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find(city => city.slug === slug)
}

// Find nearest city to coordinates
export function getNearestCity(lat: number, lng: number): City {
  let nearest = CITIES[0]
  let minDistance = Infinity

  for (const city of CITIES) {
    const distance = Math.sqrt(
      Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2)
    )
    if (distance < minDistance) {
      minDistance = distance
      nearest = city
    }
  }

  return nearest
}

// Popular cities for quick access (top 8 by population)
export const POPULAR_CITIES = CITIES_BY_POPULATION.slice(0, 8)
