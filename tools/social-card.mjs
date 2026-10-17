// Inspect the PNG header itself rather than trusting a .png filename or the dimensions declared in HTML.
export const SOCIAL_CARD_MAX_BYTES = 300_000;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

export function socialCardProblems(png) {
  const problems = [];
  if (png.length >= SOCIAL_CARD_MAX_BYTES) problems.push(`share image is ${png.length} bytes (must be under ${SOCIAL_CARD_MAX_BYTES})`);
  if (png.length < 33 || !png.subarray(0, 8).equals(PNG_SIGNATURE) || png.readUInt32BE(8) !== 13 || png.subarray(12, 16).toString('ascii') !== 'IHDR') {
    problems.push('share image must be a PNG with a complete IHDR chunk');
    return problems;
  }
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  if (width !== 1200 || height !== 630) problems.push(`share image is ${width}x${height} (must be 1200x630)`);
  return problems;
}
