import { getRadarFramesWithImageData } from '@/lib/bom/client'

export interface Prediction {
  willRain: boolean
  minutesUntil: number | null
  intensity: 'light' | 'moderate' | 'heavy' | null
  direction: string
  confidence: number
}

// BOM radar image specs
const RADAR_SIZE = 512 // pixels
const FRAME_INTERVAL = 6 // minutes between frames

// Rain color detection (BOM uses specific colors)
// BOM color scale: light blue -> green -> yellow -> orange -> red -> magenta
function isRainPixel(r: number, g: number, b: number, a: number): boolean {
  // Skip transparent/black pixels
  if (a < 50) return false
  if (r < 30 && g < 30 && b < 30) return false

  // Light rain: cyan/light blue (RGB ~100-200, 200-255, 200-255)
  if (b > 150 && g > 150 && r < 150) return true

  // Light-moderate rain: green (RGB ~0-150, 200-255, 0-150)
  if (g > 180 && r < 180 && b < 180) return true

  // Moderate rain: yellow (RGB ~200-255, 200-255, 0-100)
  if (r > 180 && g > 180 && b < 150) return true

  // Heavy rain: orange (RGB ~200-255, 100-200, 0-100)
  if (r > 200 && g > 80 && g < 200 && b < 100) return true

  // Very heavy rain: red (RGB ~200-255, 0-100, 0-100)
  if (r > 200 && g < 120 && b < 120) return true

  // Extreme rain: magenta/purple (RGB ~200-255, 0-150, 200-255)
  if (r > 150 && b > 150 && g < 150) return true

  return false
}

function getIntensity(r: number, g: number, b: number): 'light' | 'moderate' | 'heavy' {
  // Extreme/very heavy: red or magenta
  if ((r > 200 && g < 120 && b < 120) || (r > 150 && b > 150 && g < 150)) {
    return 'heavy'
  }
  // Heavy: orange
  if (r > 200 && g > 80 && g < 200 && b < 100) {
    return 'heavy'
  }
  // Moderate: yellow
  if (r > 180 && g > 180 && b < 150) {
    return 'moderate'
  }
  // Light: green, cyan, blue
  return 'light'
}

// Convert lat/lng to pixel position on radar
function coordsToPixel(
  lat: number,
  lng: number,
  radarLat: number,
  radarLng: number,
  rangeKm: number
): { x: number; y: number } {
  const kmPerDegLat = 111
  const kmPerDegLng = 111 * Math.cos(radarLat * (Math.PI / 180))

  const dLat = lat - radarLat
  const dLng = lng - radarLng

  const kmNorth = dLat * kmPerDegLat
  const kmEast = dLng * kmPerDegLng

  const pixelsPerKm = RADAR_SIZE / (rangeKm * 2)

  const x = RADAR_SIZE / 2 + kmEast * pixelsPerKm
  const y = RADAR_SIZE / 2 - kmNorth * pixelsPerKm

  return { x: Math.round(x), y: Math.round(y) }
}

// Scan for rain in radius around a point
function scanForRain(
  imageData: Uint8ClampedArray,
  centerX: number,
  centerY: number,
  radiusPixels: number
): { found: boolean; avgX: number; avgY: number; intensity: 'light' | 'moderate' | 'heavy'; pixelCount: number } {
  const rainPixels: { x: number; y: number; r: number; g: number; b: number }[] = []

  for (let y = centerY - radiusPixels; y <= centerY + radiusPixels; y++) {
    for (let x = centerX - radiusPixels; x <= centerX + radiusPixels; x++) {
      // Check if within circle
      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      if (dist > radiusPixels) continue

      // Bounds check
      if (x < 0 || x >= RADAR_SIZE || y < 0 || y >= RADAR_SIZE) continue

      const idx = (y * RADAR_SIZE + x) * 4
      const r = imageData[idx]
      const g = imageData[idx + 1]
      const b = imageData[idx + 2]
      const a = imageData[idx + 3]

      if (isRainPixel(r, g, b, a)) {
        rainPixels.push({ x, y, r, g, b })
      }
    }
  }

  if (rainPixels.length === 0) {
    return { found: false, avgX: 0, avgY: 0, intensity: 'light', pixelCount: 0 }
  }

  // Calculate centroid of rain
  const avgX = rainPixels.reduce((sum, p) => sum + p.x, 0) / rainPixels.length
  const avgY = rainPixels.reduce((sum, p) => sum + p.y, 0) / rainPixels.length

  // Get dominant intensity
  const intensities = rainPixels.map((p) => getIntensity(p.r, p.g, p.b))
  const heavyCount = intensities.filter((i) => i === 'heavy').length
  const moderateCount = intensities.filter((i) => i === 'moderate').length

  let intensity: 'light' | 'moderate' | 'heavy' = 'light'
  if (heavyCount > rainPixels.length * 0.1) {
    intensity = 'heavy'
  } else if (moderateCount > rainPixels.length * 0.2) {
    intensity = 'moderate'
  }

  return { found: true, avgX, avgY, intensity, pixelCount: rainPixels.length }
}

// Calculate velocity from frame comparisons
function calculateVelocity(
  frames: { imageData: Uint8ClampedArray; timestamp: number }[],
  userX: number,
  userY: number,
  searchRadius: number
): { vx: number; vy: number } | null {
  const positions: { x: number; y: number; time: number }[] = []

  for (const frame of frames) {
    const scan = scanForRain(frame.imageData, userX, userY, searchRadius)
    if (scan.found && scan.pixelCount > 5) {
      positions.push({ x: scan.avgX, y: scan.avgY, time: frame.timestamp })
    }
  }

  if (positions.length < 2) return null

  // Use first and last positions for velocity
  const first = positions[0]
  const last = positions[positions.length - 1]
  const dt = (last.time - first.time) / 1000 / 60 // minutes

  if (dt === 0) return null

  const vx = (last.x - first.x) / dt // pixels per minute
  const vy = (last.y - first.y) / dt

  return { vx, vy }
}

function velocityToDirection(vx: number, vy: number): string {
  // Note: vy is inverted (negative = moving north on screen)
  // We want to show where rain is coming FROM
  const angle = Math.atan2(vx, -vy) * (180 / Math.PI)
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const idx = Math.round(((angle + 180 + 360) % 360) / 45) % 8
  return directions[idx]
}

export async function predictRain(
  userLat: number,
  userLng: number,
  radarId: string,
  radarLat: number,
  radarLng: number,
  rangeKm: number = 128
): Promise<Prediction> {
  try {
    // 1. Get radar frames with image data
    const frames = await getRadarFramesWithImageData(radarId, 6)

    if (frames.length === 0) {
      return {
        willRain: false,
        minutesUntil: null,
        intensity: null,
        direction: '',
        confidence: 0,
      }
    }

    // 2. Convert user location to radar pixels
    const userPixel = coordsToPixel(userLat, userLng, radarLat, radarLng, rangeKm)

    // Check if user is within radar range
    if (userPixel.x < 0 || userPixel.x >= RADAR_SIZE || userPixel.y < 0 || userPixel.y >= RADAR_SIZE) {
      console.warn('User location outside radar range')
      return {
        willRain: false,
        minutesUntil: null,
        intensity: null,
        direction: '',
        confidence: 0,
      }
    }

    // 3. Check if rain is already at user location (small radius)
    const latestFrame = frames[frames.length - 1]
    const atLocation = scanForRain(latestFrame.imageData, userPixel.x, userPixel.y, 8)

    if (atLocation.found) {
      return {
        willRain: true,
        minutesUntil: 0,
        intensity: atLocation.intensity,
        direction: 'overhead',
        confidence: 95,
      }
    }

    // 4. Search expanding radii for approaching rain
    // At 128km range: 512px = 256km, so 1px ≈ 0.5km
    // Search radii in pixels: ~5km, 10km, 20km, 35km, 50km
    const searchRadii = [10, 20, 40, 70, 100]

    for (const radius of searchRadii) {
      const scan = scanForRain(latestFrame.imageData, userPixel.x, userPixel.y, radius)
      if (!scan.found || scan.pixelCount < 5) continue

      // Calculate velocity of rain in this area
      const velocity = calculateVelocity(frames, userPixel.x, userPixel.y, radius)
      if (!velocity) continue

      // Speed in pixels per minute
      const speed = Math.sqrt(velocity.vx ** 2 + velocity.vy ** 2)
      if (speed < 0.3) continue // Too slow, probably stationary

      // Distance from rain centroid to user
      const dx = userPixel.x - scan.avgX
      const dy = userPixel.y - scan.avgY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Is it moving toward user? (dot product of displacement and velocity)
      const dotProduct = dx * velocity.vx + dy * velocity.vy
      if (dotProduct <= 0) continue // Moving away or perpendicular

      // Calculate how directly it's moving toward user
      const movingTowardFactor = dotProduct / (distance * speed)
      if (movingTowardFactor < 0.3) continue // Not moving directly enough toward user

      // ETA in minutes
      const eta = distance / speed

      if (eta <= 90) {
        // Convert pixel speed to km/h for logging
        const kmPerPixel = (rangeKm * 2) / RADAR_SIZE
        const speedKmh = speed * kmPerPixel * 60

        console.log(`Rain prediction: ${scan.intensity} rain ~${Math.round(eta)}min away, ` +
          `moving at ${speedKmh.toFixed(1)}km/h from ${velocityToDirection(velocity.vx, velocity.vy)}`)

        // Confidence based on distance, speed consistency, and direction
        const distanceConfidence = Math.max(0, 100 - eta)
        const directionConfidence = movingTowardFactor * 100
        const confidence = Math.round((distanceConfidence + directionConfidence) / 2)

        return {
          willRain: true,
          minutesUntil: Math.round(eta),
          intensity: scan.intensity,
          direction: velocityToDirection(velocity.vx, velocity.vy),
          confidence: Math.min(90, Math.max(40, confidence)),
        }
      }
    }

    // No rain approaching within 90 minutes
    return {
      willRain: false,
      minutesUntil: null,
      intensity: null,
      direction: '',
      confidence: 80,
    }
  } catch (error) {
    console.error('Rain prediction error:', error)
    return {
      willRain: false,
      minutesUntil: null,
      intensity: null,
      direction: '',
      confidence: 0,
    }
  }
}
