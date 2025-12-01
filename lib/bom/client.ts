import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache TTLs in seconds
const CACHE_TTL = {
  radar: 5 * 60,           // 5 minutes - radar images update every 6-10 min
  background: 24 * 60 * 60, // 24 hours - static terrain layer
  locations: 24 * 60 * 60,  // 24 hours - static location labels
  range: 24 * 60 * 60,      // 24 hours - static range rings
  frames: 2 * 60,           // 2 minutes - frame index refresh
}

// BOM URL patterns
const BOM_BASE_URL = 'http://www.bom.gov.au'
const BOM_RADAR_URL = `${BOM_BASE_URL}/radar`
const BOM_TRANSPARENCY_URL = `${BOM_BASE_URL}/products/radar_transparencies`

// Radar frame info
export interface RadarFrame {
  timestamp: string      // Format: YYYYMMDDHHMM (UTC)
  url: string           // Full URL to the frame image
  localTime: Date       // Australian local time
}

export interface RadarFramesResponse {
  radarId: string
  frames: RadarFrame[]
  latestTimestamp: string
}

// Generate frame timestamps for the past ~30-60 minutes
// BOM updates every 6 minutes, so we get 6 frames
function generateFrameTimestamps(): string[] {
  const now = new Date()
  const timestamps: string[] = []

  // Round down to nearest 6 minutes
  const minutes = now.getUTCMinutes()
  const roundedMinutes = Math.floor(minutes / 6) * 6
  now.setUTCMinutes(roundedMinutes, 0, 0)

  // Generate 6 timestamps going back in time
  for (let i = 5; i >= 0; i--) {
    const frameTime = new Date(now.getTime() - (i * 6 * 60 * 1000))
    const timestamp = formatTimestamp(frameTime)
    timestamps.push(timestamp)
  }

  return timestamps
}

function formatTimestamp(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const mins = String(date.getUTCMinutes()).padStart(2, '0')
  return `${year}${month}${day}${hours}${mins}`
}

function timestampToLocalTime(timestamp: string): Date {
  // Parse UTC timestamp and convert to AEST (UTC+10) / AEDT (UTC+11)
  const year = parseInt(timestamp.slice(0, 4))
  const month = parseInt(timestamp.slice(4, 6)) - 1
  const day = parseInt(timestamp.slice(6, 8))
  const hours = parseInt(timestamp.slice(8, 10))
  const mins = parseInt(timestamp.slice(10, 12))

  return new Date(Date.UTC(year, month, day, hours, mins))
}

// Fetch with proper headers (BOM blocks requests without proper User-Agent)
async function fetchFromBOM(url: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RadarPro/1.0 (Australian Weather Application)',
        'Accept': 'image/png, image/gif, */*',
        'Referer': 'http://www.bom.gov.au/',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error(`BOM fetch failed: ${url} - ${response.status}`)
      return null
    }

    return await response.arrayBuffer()
  } catch (error) {
    console.error(`BOM fetch error: ${url}`, error)
    return null
  }
}

// Get available radar frames for animation
export async function getRadarFrames(radarId: string): Promise<RadarFramesResponse> {
  const cacheKey = `radarpro:frames:${radarId}`

  // Check cache first
  const cached = await redis.get<RadarFramesResponse>(cacheKey)
  if (cached) {
    return cached
  }

  const timestamps = generateFrameTimestamps()
  const frames: RadarFrame[] = timestamps.map(timestamp => ({
    timestamp,
    url: `${BOM_RADAR_URL}/${radarId}.T.${timestamp}.png`,
    localTime: timestampToLocalTime(timestamp),
  }))

  const response: RadarFramesResponse = {
    radarId,
    frames,
    latestTimestamp: timestamps[timestamps.length - 1],
  }

  // Cache the frame list
  await redis.set(cacheKey, response, { ex: CACHE_TTL.frames })

  return response
}

// Get a specific radar frame image (returns base64)
export async function getRadarFrame(
  radarId: string,
  timestamp?: string
): Promise<{ data: string; contentType: string } | null> {
  // Use latest frame if no timestamp provided
  const ts = timestamp || formatTimestamp(new Date())
  const cacheKey = `radarpro:radar:${radarId}:${ts}`

  // Check cache
  const cached = await redis.get<string>(cacheKey)
  if (cached) {
    return { data: cached, contentType: 'image/png' }
  }

  // Try timestamped PNG first
  let url = `${BOM_RADAR_URL}/${radarId}.T.${ts}.png`
  let buffer = await fetchFromBOM(url)

  // Fall back to current GIF if timestamped PNG not available
  if (!buffer) {
    url = `${BOM_RADAR_URL}/${radarId}.gif`
    buffer = await fetchFromBOM(url)
    if (!buffer) return null
  }

  // Convert to base64 for caching
  const base64 = Buffer.from(buffer).toString('base64')

  // Cache the image
  await redis.set(cacheKey, base64, { ex: CACHE_TTL.radar })

  return {
    data: base64,
    contentType: url.endsWith('.gif') ? 'image/gif' : 'image/png'
  }
}

// Get the current/latest radar image
export async function getCurrentRadar(radarId: string): Promise<{ data: string; contentType: string } | null> {
  const cacheKey = `radarpro:current:${radarId}`

  // Check cache
  const cached = await redis.get<string>(cacheKey)
  if (cached) {
    return { data: cached, contentType: 'image/gif' }
  }

  // Fetch the animated GIF (always current)
  const url = `${BOM_RADAR_URL}/${radarId}.gif`
  const buffer = await fetchFromBOM(url)
  if (!buffer) return null

  const base64 = Buffer.from(buffer).toString('base64')
  await redis.set(cacheKey, base64, { ex: CACHE_TTL.radar })

  return { data: base64, contentType: 'image/gif' }
}

// Get static background layer
export async function getBackground(radarId: string): Promise<{ data: string; contentType: string } | null> {
  const cacheKey = `radarpro:background:${radarId}`

  const cached = await redis.get<string>(cacheKey)
  if (cached) {
    return { data: cached, contentType: 'image/png' }
  }

  const url = `${BOM_TRANSPARENCY_URL}/${radarId}.background.png`
  const buffer = await fetchFromBOM(url)
  if (!buffer) return null

  const base64 = Buffer.from(buffer).toString('base64')
  await redis.set(cacheKey, base64, { ex: CACHE_TTL.background })

  return { data: base64, contentType: 'image/png' }
}

// Get location labels layer
export async function getLocations(radarId: string): Promise<{ data: string; contentType: string } | null> {
  const cacheKey = `radarpro:locations:${radarId}`

  const cached = await redis.get<string>(cacheKey)
  if (cached) {
    return { data: cached, contentType: 'image/png' }
  }

  const url = `${BOM_TRANSPARENCY_URL}/${radarId}.locations.png`
  const buffer = await fetchFromBOM(url)
  if (!buffer) return null

  const base64 = Buffer.from(buffer).toString('base64')
  await redis.set(cacheKey, base64, { ex: CACHE_TTL.locations })

  return { data: base64, contentType: 'image/png' }
}

// Get range rings layer
export async function getRange(radarId: string): Promise<{ data: string; contentType: string } | null> {
  const cacheKey = `radarpro:range:${radarId}`

  const cached = await redis.get<string>(cacheKey)
  if (cached) {
    return { data: cached, contentType: 'image/png' }
  }

  const url = `${BOM_TRANSPARENCY_URL}/${radarId}.range.png`
  const buffer = await fetchFromBOM(url)
  if (!buffer) return null

  const base64 = Buffer.from(buffer).toString('base64')
  await redis.set(cacheKey, base64, { ex: CACHE_TTL.range })

  return { data: base64, contentType: 'image/png' }
}

// Helper to get the full radar ID with range suffix
export function getRadarIdWithRange(baseId: string, range: '64' | '128' | '256' | '512'): string {
  // baseId comes in as IDR713 (already has range), extract base (IDR71)
  // or baseId might be IDR71 (no range yet)

  const rangeSuffix: Record<string, string> = {
    '64': '1',
    '128': '2',
    '256': '3',
    '512': '4',
  }

  // If the ID already ends with a range digit, replace it
  if (baseId.length === 6) {
    const base = baseId.slice(0, 5)
    return `${base}${rangeSuffix[range]}`
  }

  // If it's a base ID (5 chars), add the range
  return `${baseId}${rangeSuffix[range]}`
}

// Clear cache for a specific radar
export async function clearRadarCache(radarId: string): Promise<void> {
  const keys = [
    `radarpro:frames:${radarId}`,
    `radarpro:current:${radarId}`,
    `radarpro:background:${radarId}`,
    `radarpro:locations:${radarId}`,
    `radarpro:range:${radarId}`,
  ]

  await Promise.all(keys.map(key => redis.del(key)))
}
