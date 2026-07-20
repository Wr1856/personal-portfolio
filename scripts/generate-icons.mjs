// Generates the app icons from the WM monogram SVG using sharp.
// Run with: node scripts/generate-icons.mjs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

function monogramSvg({ size, padded }) {
  const scale = padded ? 0.62 : 0.86;
  const inner = size * scale;
  const offset = (size - inner) / 2;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#05070B" />
  <g transform="translate(${offset}, ${offset})">
    <circle cx="${inner / 2}" cy="${inner / 2}" r="${inner * 0.47}" fill="none"
      stroke="#8C7650" stroke-width="${Math.max(2, size * 0.012)}" />
    <circle cx="${inner / 2}" cy="${inner / 2}" r="${inner * 0.4}" fill="none"
      stroke="#8C7650" stroke-width="${Math.max(1, size * 0.006)}" opacity="0.5" />
    <text x="${inner / 2}" y="${inner / 2}" text-anchor="middle"
      dominant-baseline="central" font-family="Georgia, serif"
      font-size="${inner * 0.34}" font-weight="600" letter-spacing="${inner * 0.01}"
      fill="#E8E2D6">WM</text>
  </g>
</svg>`;
}

async function render(svg, size, file) {
  const buffer = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  await writeFile(file, buffer);
  console.log(`written ${path.relative(root, file)}`);
}

const iconsDir = path.join(root, "public", "icons");
await mkdir(iconsDir, { recursive: true });

await render(monogramSvg({ size: 512, padded: false }), 192, path.join(iconsDir, "icon-192.png"));
await render(monogramSvg({ size: 512, padded: false }), 512, path.join(iconsDir, "icon-512.png"));
await render(monogramSvg({ size: 512, padded: true }), 512, path.join(iconsDir, "icon-maskable-512.png"));
await render(monogramSvg({ size: 512, padded: false }), 512, path.join(root, "src", "app", "icon.png"));
await render(monogramSvg({ size: 512, padded: false }), 180, path.join(root, "src", "app", "apple-icon.png"));
