import { NextRequest, NextResponse } from 'next/server';
import { getRadarFramesWithImageData, getCurrentRadar } from '@/lib/bom/client';
import { calculateVelocity, directionToCompass, FrameData } from '@/lib/radar/motion-tracker';
import { generatePredictedFrames } from '@/lib/radar/frame-renderer';
import { Redis } from '@upstash/redis';

export const runtime = 'nodejs';
export const maxDuration = 30;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface PredictedRadarResponse {
  radarId: string;
  generatedAt: number;
  velocity: {
    speed: number;
    direction: number;
    compass: string;
  };
  frames: {
    minutesAhead: number;
    url: string;
    confidence: number;
  }[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const radarId = searchParams.get('radarId') || 'IDR713';

  try {
    // Check cache first
    const cacheKey = `radarpro:predict:${radarId}`;
    const cached = await redis.get<PredictedRadarResponse>(cacheKey);

    if (cached && Date.now() - cached.generatedAt < 5 * 60 * 1000) {
      return NextResponse.json(cached);
    }

    // Fetch last 6 frames for motion analysis
    const rawFrames = await getRadarFramesWithImageData(radarId, 6);

    if (rawFrames.length < 2) {
      return NextResponse.json(
        { error: 'Insufficient radar data for prediction' },
        { status: 503 }
      );
    }

    // Convert to FrameData format for motion tracker
    const frames: FrameData[] = rawFrames.map(f => ({
      timestamp: f.timestamp,
      imageData: f.imageData,
      width: 512,
      height: 512
    }));

    // Calculate velocity
    const velocity = calculateVelocity(frames, 256);

    // Get latest frame for prediction base
    const latestRadar = await getCurrentRadar(radarId);
    if (!latestRadar) {
      return NextResponse.json(
        { error: 'Failed to get current radar image' },
        { status: 503 }
      );
    }

    const latestFrameBuffer = Buffer.from(latestRadar.data, 'base64');

    // Generate predicted frames (every 10 mins up to 2 hours)
    const predictedFrames = await generatePredictedFrames(
      latestFrameBuffer,
      velocity,
      120,
      10
    );

    // Store predicted frame images
    const frameData = await Promise.all(
      predictedFrames.map(async (frame) => {
        const frameKey = `radarpro:predict:frame:${radarId}:${frame.minutesAhead}`;
        await redis.set(frameKey, frame.imageBuffer.toString('base64'), { ex: 600 });

        return {
          minutesAhead: frame.minutesAhead,
          url: `/api/radar/predict/frame?radarId=${radarId}&mins=${frame.minutesAhead}`,
          confidence: frame.confidence
        };
      })
    );

    const response: PredictedRadarResponse = {
      radarId,
      generatedAt: Date.now(),
      velocity: {
        speed: Math.round(velocity.speed),
        direction: Math.round(velocity.direction),
        compass: directionToCompass(velocity.direction)
      },
      frames: frameData
    };

    // Cache the response
    await redis.set(cacheKey, response, { ex: 300 });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to generate predictions' },
      { status: 500 }
    );
  }
}
