import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const radarId = searchParams.get('radarId');
  const mins = searchParams.get('mins');

  if (!radarId || !mins) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const frameKey = `radarpro:predict:frame:${radarId}:${mins}`;
  const frameBase64 = await redis.get<string>(frameKey);

  if (!frameBase64) {
    return NextResponse.json({ error: 'Frame not found - predictions may have expired' }, { status: 404 });
  }

  const buffer = Buffer.from(frameBase64, 'base64');

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
