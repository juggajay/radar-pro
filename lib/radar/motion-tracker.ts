import { createCanvas, loadImage } from 'canvas';

interface RainCell {
  x: number;
  y: number;
  intensity: number;
  area: number;
}

export interface VelocityVector {
  vx: number;
  vy: number;
  speed: number;
  direction: number;
}

export interface FrameData {
  timestamp: number;
  imageData: Uint8ClampedArray;
  width: number;
  height: number;
}

// BOM rain color detection
function isRainPixel(r: number, g: number, b: number, a: number): boolean {
  if (a < 128) return false;

  // BOM color scale (approximate)
  // Light rain: cyan/light blue
  if (g > 180 && b > 180 && r < 100) return true;
  // Moderate rain: green/yellow
  if (g > 180 && r > 100 && b < 150) return true;
  // Heavy rain: orange/red
  if (r > 180 && g < 150 && b < 100) return true;
  // Very heavy: magenta/purple
  if (r > 150 && b > 150 && g < 100) return true;

  return false;
}

function getRainIntensity(r: number, g: number, b: number): number {
  if (r > 200 && g < 100) return 255;
  if (r > 180 && g > 100 && g < 180) return 200;
  if (g > 180 && r > 150) return 150;
  if (g > 180 && b > 180) return 100;
  return 50;
}

// Find rain cells using connected component analysis
export function findRainCells(frame: FrameData): RainCell[] {
  const { imageData, width, height } = frame;
  const visited = new Set<number>();
  const cells: RainCell[] = [];

  const getIndex = (x: number, y: number) => y * width + x;
  const getPixel = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    return {
      r: imageData[i],
      g: imageData[i + 1],
      b: imageData[i + 2],
      a: imageData[i + 3]
    };
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = getIndex(x, y);
      if (visited.has(idx)) continue;

      const { r, g, b, a } = getPixel(x, y);
      if (!isRainPixel(r, g, b, a)) continue;

      const stack: [number, number][] = [[x, y]];
      let sumX = 0, sumY = 0, count = 0, totalIntensity = 0;

      while (stack.length > 0) {
        const [cx, cy] = stack.pop()!;
        const cIdx = getIndex(cx, cy);

        if (visited.has(cIdx)) continue;
        if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;

        const pixel = getPixel(cx, cy);
        if (!isRainPixel(pixel.r, pixel.g, pixel.b, pixel.a)) continue;

        visited.add(cIdx);
        sumX += cx;
        sumY += cy;
        totalIntensity += getRainIntensity(pixel.r, pixel.g, pixel.b);
        count++;

        stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
      }

      if (count > 50) {
        cells.push({
          x: sumX / count,
          y: sumY / count,
          intensity: totalIntensity / count,
          area: count
        });
      }
    }
  }

  return cells;
}

// Match cells between frames using nearest neighbor
function matchCells(
  prevCells: RainCell[],
  currCells: RainCell[],
  maxDistance: number = 100
): Map<number, number> {
  const matches = new Map<number, number>();
  const usedCurr = new Set<number>();

  for (let i = 0; i < prevCells.length; i++) {
    let bestMatch = -1;
    let bestDist = maxDistance;

    for (let j = 0; j < currCells.length; j++) {
      if (usedCurr.has(j)) continue;

      const dx = currCells[j].x - prevCells[i].x;
      const dy = currCells[j].y - prevCells[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const intensityDiff = Math.abs(currCells[j].intensity - prevCells[i].intensity);
      const score = dist + intensityDiff * 0.5;

      if (score < bestDist) {
        bestDist = score;
        bestMatch = j;
      }
    }

    if (bestMatch >= 0) {
      matches.set(i, bestMatch);
      usedCurr.add(bestMatch);
    }
  }

  return matches;
}

// Calculate average velocity from multiple frame pairs
export function calculateVelocity(
  frames: FrameData[],
  radarRangeKm: number = 256
): VelocityVector {
  if (frames.length < 2) {
    return { vx: 0, vy: 0, speed: 0, direction: 0 };
  }

  const frameInterval = 6;

  let totalVx = 0, totalVy = 0, samples = 0;

  for (let i = 0; i < frames.length - 1; i++) {
    const prevCells = findRainCells(frames[i]);
    const currCells = findRainCells(frames[i + 1]);
    const matches = matchCells(prevCells, currCells);

    for (const [prevIdx, currIdx] of matches) {
      const dx = currCells[currIdx].x - prevCells[prevIdx].x;
      const dy = currCells[currIdx].y - prevCells[prevIdx].y;

      const weight = Math.min(prevCells[prevIdx].area, currCells[currIdx].area) / 1000;

      totalVx += dx * weight;
      totalVy += dy * weight;
      samples += weight;
    }
  }

  if (samples === 0) {
    return { vx: 0, vy: 0, speed: 0, direction: 0 };
  }

  const vx = totalVx / samples;
  const vy = totalVy / samples;

  const pixelSpeed = Math.sqrt(vx * vx + vy * vy);
  const kmPerPixel = (radarRangeKm * 2) / frames[0].width;
  const speedKmPerMin = (pixelSpeed * kmPerPixel) / frameInterval;
  const speedKmh = speedKmPerMin * 60;

  let direction = Math.atan2(-vx, vy) * (180 / Math.PI);
  direction = (direction + 360) % 360;

  return { vx, vy, speed: speedKmh, direction };
}

export function directionToCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Convert image buffer to FrameData
export async function bufferToFrameData(
  buffer: Buffer,
  timestamp: number
): Promise<FrameData> {
  const img = await loadImage(buffer);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);

  return {
    timestamp,
    imageData: imageData.data,
    width: img.width,
    height: img.height
  };
}
