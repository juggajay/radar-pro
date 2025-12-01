import { NextRequest, NextResponse } from 'next/server'
import {
  getRadarFrames,
  getRadarFrame,
  getCurrentRadar,
} from '@/lib/bom/client'
import { getRadarIdForRange, parseRadarId } from '@/data/radars'

interface RouteParams {
  params: Promise<{ radarId: string }>
}

// GET /api/radar/IDR713 - Get radar data
// Query params:
//   - type: 'frames' | 'current' | 'frame' (default: 'current')
//   - range: '64' | '128' | '256' | '512' (optional, overrides radarId range)
//   - timestamp: string (for type=frame, specific frame timestamp)
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { radarId: rawRadarId } = await params
  const searchParams = request.nextUrl.searchParams

  const type = searchParams.get('type') || 'current'
  const range = searchParams.get('range') as '64' | '128' | '256' | '512' | null
  const timestamp = searchParams.get('timestamp')

  // Determine the full radar ID
  let radarId = rawRadarId
  if (range) {
    const { baseId } = parseRadarId(rawRadarId)
    radarId = getRadarIdForRange(baseId, parseInt(range) as 64 | 128 | 256 | 512)
  }

  try {
    switch (type) {
      case 'frames': {
        // Return frame metadata (timestamps and URLs)
        const framesData = await getRadarFrames(radarId)
        return NextResponse.json(framesData)
      }

      case 'frame': {
        // Return a specific frame image
        const frame = await getRadarFrame(radarId, timestamp || undefined)
        if (!frame) {
          return NextResponse.json(
            { error: 'Frame not available' },
            { status: 404 }
          )
        }

        // Return as binary image
        const buffer = Buffer.from(frame.data, 'base64')
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': frame.contentType,
            'Cache-Control': 'public, max-age=300',
          },
        })
      }

      case 'current':
      default: {
        // Return the current/latest radar image
        const current = await getCurrentRadar(radarId)
        if (!current) {
          return NextResponse.json(
            { error: 'Radar not available' },
            { status: 404 }
          )
        }

        const buffer = Buffer.from(current.data, 'base64')
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': current.contentType,
            'Cache-Control': 'public, max-age=300',
          },
        })
      }
    }
  } catch (error) {
    console.error('Radar API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch radar data' },
      { status: 500 }
    )
  }
}
