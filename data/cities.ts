// Australian cities for SEO pages and location search

export interface City {
  slug: string;
  name: string;
  state: string;
  stateCode: string;
  lat: number;
  lng: number;
  population: number;
  radarId: string;
}

export const CITIES: City[] = [
  // NSW
  { slug: 'sydney', name: 'Sydney', state: 'New South Wales', stateCode: 'NSW', lat: -33.8688, lng: 151.2093, population: 5312000, radarId: 'IDR713' },
  { slug: 'newcastle', name: 'Newcastle', state: 'New South Wales', stateCode: 'NSW', lat: -32.9283, lng: 151.7817, population: 322000, radarId: 'IDR043' },
  { slug: 'wollongong', name: 'Wollongong', state: 'New South Wales', stateCode: 'NSW', lat: -34.4278, lng: 150.8931, population: 302000, radarId: 'IDR033' },
  { slug: 'central-coast', name: 'Central Coast', state: 'New South Wales', stateCode: 'NSW', lat: -33.4245, lng: 151.3416, population: 333000, radarId: 'IDR713' },
  { slug: 'wagga-wagga', name: 'Wagga Wagga', state: 'New South Wales', stateCode: 'NSW', lat: -35.1082, lng: 147.3598, population: 67000, radarId: 'IDR403' },
  { slug: 'coffs-harbour', name: 'Coffs Harbour', state: 'New South Wales', stateCode: 'NSW', lat: -30.2963, lng: 153.1157, population: 73000, radarId: 'IDR283' },

  // VIC
  { slug: 'melbourne', name: 'Melbourne', state: 'Victoria', stateCode: 'VIC', lat: -37.8136, lng: 144.9631, population: 5078000, radarId: 'IDR023' },
  { slug: 'geelong', name: 'Geelong', state: 'Victoria', stateCode: 'VIC', lat: -38.1499, lng: 144.3617, population: 270000, radarId: 'IDR023' },
  { slug: 'ballarat', name: 'Ballarat', state: 'Victoria', stateCode: 'VIC', lat: -37.5622, lng: 143.8503, population: 111000, radarId: 'IDR023' },
  { slug: 'bendigo', name: 'Bendigo', state: 'Victoria', stateCode: 'VIC', lat: -36.7570, lng: 144.2794, population: 100000, radarId: 'IDR023' },

  // QLD
  { slug: 'brisbane', name: 'Brisbane', state: 'Queensland', stateCode: 'QLD', lat: -27.4698, lng: 153.0251, population: 2514000, radarId: 'IDR663' },
  { slug: 'gold-coast', name: 'Gold Coast', state: 'Queensland', stateCode: 'QLD', lat: -28.0167, lng: 153.4000, population: 679000, radarId: 'IDR503' },
  { slug: 'sunshine-coast', name: 'Sunshine Coast', state: 'Queensland', stateCode: 'QLD', lat: -26.6500, lng: 153.0667, population: 351000, radarId: 'IDR943' },
  { slug: 'townsville', name: 'Townsville', state: 'Queensland', stateCode: 'QLD', lat: -19.2500, lng: 146.8167, population: 180000, radarId: 'IDR733' },
  { slug: 'cairns', name: 'Cairns', state: 'Queensland', stateCode: 'QLD', lat: -16.9186, lng: 145.7781, population: 153000, radarId: 'IDR083' },

  // WA
  { slug: 'perth', name: 'Perth', state: 'Western Australia', stateCode: 'WA', lat: -31.9505, lng: 115.8605, population: 2085000, radarId: 'IDR703' },
  { slug: 'bunbury', name: 'Bunbury', state: 'Western Australia', stateCode: 'WA', lat: -33.3333, lng: 115.6333, population: 75000, radarId: 'IDR703' },

  // SA
  { slug: 'adelaide', name: 'Adelaide', state: 'South Australia', stateCode: 'SA', lat: -34.9285, lng: 138.6007, population: 1376000, radarId: 'IDR643' },

  // TAS
  { slug: 'hobart', name: 'Hobart', state: 'Tasmania', stateCode: 'TAS', lat: -42.8821, lng: 147.3272, population: 238000, radarId: 'IDR763' },
  { slug: 'launceston', name: 'Launceston', state: 'Tasmania', stateCode: 'TAS', lat: -41.4333, lng: 147.1333, population: 90000, radarId: 'IDR523' },

  // NT
  { slug: 'darwin', name: 'Darwin', state: 'Northern Territory', stateCode: 'NT', lat: -12.4634, lng: 130.8456, population: 147000, radarId: 'IDR633' },
  { slug: 'alice-springs', name: 'Alice Springs', state: 'Northern Territory', stateCode: 'NT', lat: -23.6980, lng: 133.8807, population: 26000, radarId: 'IDR253' },

  // ACT
  { slug: 'canberra', name: 'Canberra', state: 'Australian Capital Territory', stateCode: 'ACT', lat: -35.2809, lng: 149.1300, population: 457000, radarId: 'IDR403' },
];

export const CITIES_BY_POPULATION = [...CITIES].sort((a, b) => b.population - a.population);

export const POPULAR_CITIES = CITIES_BY_POPULATION.slice(0, 8);

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find(city => city.slug === slug);
}

export function getNearestCity(lat: number, lng: number): City {
  let nearest = CITIES[0];
  let minDistance = Infinity;

  for (const city of CITIES) {
    const distance = Math.sqrt(
      Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }

  return nearest;
}
