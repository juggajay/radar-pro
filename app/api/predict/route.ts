import { NextRequest, NextResponse } from 'next/server'
import { predictRain } from '@/lib/weather/rain-predictor'
import { getRadarForLocation, getRadarIdForRange, getStationByRadarId } from '@/data/radars'

// GET /api/predict?lat=-33.87&lng=151.21
// Optional: &radarId=IDR713 (use specific radar instead of nearest)
// Optional: &range=128 (default 128km for prediction)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const lat = parseFloat(searchParams.get('lat') || '-33.8688')
  const lng = parseFloat(searchParams.get('lng') || '151.2093')
  const radarIdParam = searchParams.get('radarId')
  const rangeParam = searchParams.get('range') || '128'

  // Validate coordinates
  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: 'Invalid coordinates' },
      { status: 400 }
    )
  }

  // Validate range
  const range = parseInt(rangeParam) as 64 | 128 | 256 | 512
  if (![64, 128, 256, 512].includes(range)) {
    return NextResponse.json(
      { error: 'Invalid range. Use: 64, 128, 256, or 512' },
      { status: 400 }
    )
  }

  try {
    // Get radar station (either specified or nearest)
    let station
    if (radarIdParam) {
      station = getStationByRadarId(radarIdParam)
      if (!station) {
        return NextResponse.json(
          { error: 'Unknown radar ID' },
          { status: 400 }
        )
      }
    } else {
      station = getRadarForLocation(lat, lng)
    }

    // Get the full radar ID with range suffix
    const radarId = getRadarIdForRange(station.id, range)

    // Run prediction algorithm
    const prediction = await predictRain(
      lat,
      lng,
      radarId,
      station.lat,
      station.lng,
      range
    )

    return NextResponse.json({
      ...prediction,
      radar: {
        id: radarId,
        station: station.name,
        city: station.city,
        range,
      },
      location: {
        lat,
        lng,
      },
    })
  } catch (error) {
    console.error('Prediction API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    )
  }
}
