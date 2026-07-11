import sharp from 'sharp';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const iconsDir = join(publicDir, 'icons');

// Ensure icons directory exists
mkdirSync(iconsDir, { recursive: true });

const svgBuffer = readFileSync(join(iconsDir, 'icon.svg'));

const sizes = [48, 72, 96, 128, 144, 152, 192, 256, 384, 512];
const pngPromises = sizes.map(size =>
  sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(iconsDir, `icon-${size}x${size}.png`))
    .then(() => console.log(`✓ Generated ${size}x${size}`))
);

// Also generate maskable icon with padding for Android
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#6366F1"/>
  <text x="256" y="292" font-family="system-ui, -apple-system, sans-serif" font-size="200" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-6">C</text>
</svg>`;

const maskablePromise = sharp(Buffer.from(maskableSvg))
  .resize(192, 192)
  .png()
  .toFile(join(iconsDir, 'maskable-icon-192x192.png'))
  .then(() => console.log('✓ Generated maskable-icon-192x192'));

const maskable512Promise = sharp(Buffer.from(maskableSvg))
  .resize(512, 512)
  .png()
  .toFile(join(iconsDir, 'maskable-icon-512x512.png'))
  .then(() => console.log('✓ Generated maskable-icon-512x512'));

await Promise.all([...pngPromises, maskablePromise, maskable512Promise]);

// Generate the manifest icons array as reference
const iconEntries = [
  ...sizes.map(s => ({
    src: `/icons/icon-${s}x${s}.png`,
    sizes: `${s}x${s}`,
    type: 'image/png',
    purpose: 'any'
  })),
  { src: '/icons/maskable-icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
  { src: '/icons/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
];

console.log('\nAll icons generated!');
console.log(JSON.stringify(iconEntries, null, 2));
