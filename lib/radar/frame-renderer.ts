import { createCanvas, loadImage } from 'canvas';
import { VelocityVector } from './motion-tracker';

export interface PredictedFrame {
  minutesAhead: number;
  imageBuffer: Buffer;
  confidence: number;
}

// Shift rain pixels by velocity to create predicted frame
export async function renderPredictedFrame(
  currentFrameBuffer: Buffer,
  velocity: VelocityVector,
  minutesAhead: number,
  frameInterval: number = 6
): Promise<PredictedFrame> {
  const img = await loadImage(currentFrameBuffer);
  const width = img.width;
  const height = img.height;

  const srcCanvas = createCanvas(width, height);
  const srcCtx = srcCanvas.getContext('2d');
  srcCtx.drawImage(img, 0, 0);
  const srcData = srcCtx.getImageData(0, 0, width, height);

  const dstCanvas = createCanvas(width, height);
  const dstCtx = dstCanvas.getContext('2d');
  dstCtx.clearRect(0, 0, width, height);
  const dstData = dstCtx.createImageData(width, height);

  const framesAhead = minutesAhead / frameInterval;
  const shiftX = Math.round(velocity.vx * framesAhead);
  const shiftY = Math.round(velocity.vy * framesAhead);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const r = srcData.data[srcIdx];
      const g = srcData.data[srcIdx + 1];
      const b = srcData.data[srcIdx + 2];
      const a = srcData.data[srcIdx + 3];

      if (a < 128) continue;

      const newX = x + shiftX;
      const newY = y + shiftY;

      if (newX < 0 || newX >= width || newY < 0 || newY >= height) continue;

      const dstIdx = (newY * width + newX) * 4;
      dstData.data[dstIdx] = r;
      dstData.data[dstIdx + 1] = g;
      dstData.data[dstIdx + 2] = b;
      dstData.data[dstIdx + 3] = a;
    }
  }

  dstCtx.putImageData(dstData, 0, 0);

  // Apply blur for distant predictions to indicate uncertainty
  if (minutesAhead > 30) {
    const blurAmount = Math.min(minutesAhead / 40, 2);
    const tempCanvas = createCanvas(width, height);
    const tempCtx = tempCanvas.getContext('2d');

    // Simple box blur approximation
    for (let pass = 0; pass < Math.ceil(blurAmount); pass++) {
      tempCtx.drawImage(dstCanvas, 0, 0);
      dstCtx.globalAlpha = 0.8;
      dstCtx.drawImage(tempCanvas, -1, 0);
      dstCtx.drawImage(tempCanvas, 1, 0);
      dstCtx.drawImage(tempCanvas, 0, -1);
      dstCtx.drawImage(tempCanvas, 0, 1);
      dstCtx.globalAlpha = 1;
    }
  }

  const confidence = Math.max(20, 100 - (minutesAhead * 0.6));

  return {
    minutesAhead,
    imageBuffer: dstCanvas.toBuffer('image/png'),
    confidence: Math.round(confidence)
  };
}

// Generate all predicted frames
export async function generatePredictedFrames(
  currentFrameBuffer: Buffer,
  velocity: VelocityVector,
  maxMinutes: number = 120,
  intervalMinutes: number = 10
): Promise<PredictedFrame[]> {
  const frames: PredictedFrame[] = [];

  for (let mins = intervalMinutes; mins <= maxMinutes; mins += intervalMinutes) {
    const frame = await renderPredictedFrame(
      currentFrameBuffer,
      velocity,
      mins
    );
    frames.push(frame);
  }

  return frames;
}
