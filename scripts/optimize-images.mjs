// Generates the web-sized images in public/images from the originals.
// Certificates rendered from the original PDFs live in source-certs/;
// anything without an original falls back to the LinkedIn preview in dist/assets.
import sharp from 'sharp';
import { mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const path = (rel) => fileURLToPath(new URL(rel, import.meta.url));
await mkdir(path('../public/images/'), { recursive: true });

// Portrait: only sampled into a canvas (max ~1000 device px), alpha kept.
await sharp(path('../dist/assets/portrait-cutout.png'))
  .resize(1000, 1000)
  .webp({ quality: 86, alphaQuality: 90, effort: 6 })
  .toFile(path('../public/images/portrait.webp'));

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
