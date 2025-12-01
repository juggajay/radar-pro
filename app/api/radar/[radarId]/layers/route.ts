import { NextRequest, NextResponse } from 'next/server'
import {
  getBackground,
  getLocations,
  getRange,
} from '@/lib/bom/client'
import { getRadarIdForRange, parseRadarId } from '@/data/radars'

interface RouteParams {
  params: Promise<{ radarId: string }>
}

// GET /api/radar/IDR713/layers?type=background
// Query params:
//   - type: 'background' | 'locations' | 'range' (required)
//   - range: '64' | '128' | '256' | '512' (optional, overrides radarId range)
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { radarId: rawRadarId } = await params
  const searchParams = request.nextUrl.searchParams

  const type = searchParams.get('type')
  const range = searchParams.get('range') as '64' | '128' | '256' | '512' | null

  if (!type || !['background', 'locations', 'range'].includes(type)) {
    return NextResponse.json(
      { error: 'Invalid layer type. Use: background, locations, or range' },
      { status: 400 }
    )
  }

  // Determine the full radar ID
  let radarId = rawRadarId
  if (range) {
    const { baseId } = parseRadarId(rawRadarId)
    radarId = getRadarIdForRange(baseId, parseInt(range) as 64 | 128 | 256 | 512)
  }

  try {
    let layer: { data: string; contentType: string } | null = null

    switch (type) {
      case 'background':
        layer = await getBackground(radarId)
        break
      case 'locations':
        layer = await getLocations(radarId)
        break
      case 'range':
        layer = await getRange(radarId)
        break
    }

    if (!layer) {
      return NextResponse.json(
        { error: `${type} layer not available` },
        { status: 404 }
      )
    }

    const buffer = Buffer.from(layer.data, 'base64')
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': layer.contentType,
        'Cache-Control': 'public, max-age=86400', // 24 hour cache for static layers
      },
    })
  } catch (error) {
    console.error('Layers API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch layer' },
      { status: 500 }
    )
  }
}
