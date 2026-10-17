// Generates the web-sized images in public/images from the originals.
// Certificates rendered from the original PDFs live in source-certs/;
// anything without an original falls back to the LinkedIn preview in dist/assets.
import sharp from 'sharp';
import { mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const path = (rel) => fileURLToPath(new URL(rel, import.meta.url));
await mkdir(path('../public/images/'), { recursive: true });

// Portrait: the original photo plus an alpha matte (BiRefNet-portrait via rembg),
// so every pixel is the real photo. Semi-transparent edge pixels still carry the
// olive backdrop, so they borrow colour from the nearby opaque subject instead
// (alpha-weighted blur), keeping more of their own colour the more opaque they are.
{
  const original = sharp(path('../source-portrait/portrait-original.png')).removeAlpha();
  const { data: rgb, info } = await original.clone().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const matte = await sharp(path('../source-portrait/portrait-matte.png')).greyscale().resize(width, height).raw().toBuffer();
  const n = width * height;
  const fgWeighted = Buffer.alloc(n * 3);
  for (let i = 0; i < n; i += 1) {
    for (let c = 0; c < 3; c += 1) fgWeighted[i * 3 + c] = Math.round(rgb[i * 3 + c] * matte[i] / 255);
  }
  const blur = (buf, channels) => sharp(buf, { raw: { width, height, channels } }).blur(4).raw().toBuffer();
  const [fgSum, aSum] = await Promise.all([blur(fgWeighted, 3), blur(matte, 1)]);
  const rgba = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i += 1) {
    const a = matte[i] / 255;
    const keep = a * a;
    for (let c = 0; c < 3; c += 1) {
      const C = rgb[i * 3 + c];
      const F = a < .98 && aSum[i] > 0 ? Math.min(255, fgSum[i * 3 + c] * 255 / aSum[i]) * (1 - keep) + C * keep : C;
      rgba[i * 4 + c] = Math.round(F);
    }
    rgba[i * 4 + 3] = matte[i];
  }
  const cutout = sharp(rgba, { raw: { width, height, channels: 4 } });
  // Drawn into the hero canvas at device resolution: ~490px (phone, 1x) up to
  // ~1700px (desktop, 2x). The largest size is the photo's native resolution.
  for (const size of [640, 960, width]) {
    await cutout.clone().resize(size, size, { kernel: 'lanczos3' })
      .webp({ quality: 90, alphaQuality: 100, smartSubsample: true, effort: 6 })
      .toFile(path(`../public/images/portrait-${size}.webp`));
  }
}

const exists = (p) => access(p).then(() => true, () => false);
for (const name of ['cert-static', 'cert-python', 'cert-dynamic', 'cert-responsive', 'cert-flexbox']) {
  const original = path(`../source-certs/${name}.png`);
  if (await exists(original)) {
    // Card size and a sharper size for the full-screen viewer.
    for (const width of [900, 1800]) {
      await sharp(original).resize({ width }).webp({ quality: 84, effort: 6 })
        .toFile(path(`../public/images/${name}-${width}.webp`));
    }
  } else {
    const preview = sharp(path(`../dist/assets/${name}.jpg`)).webp({ quality: 82, effort: 6 });
    await preview.clone().toFile(path(`../public/images/${name}-900.webp`));
    await preview.clone().toFile(path(`../public/images/${name}-1800.webp`));
  }
}
console.log('images written to public/images');
