// Hero portrait sizes (from scripts/optimize-images.mjs). `sizes` mirrors the
// square the canvas draws in buildParticles(): min(125vw, 68vh) on phones, 93vh on desktop.
export const PORTRAIT_SRCSET = '/images/portrait-640.webp 640w, /images/portrait-960.webp 960w, /images/portrait-1254.webp 1254w';
export const PORTRAIT_SIZES = '(max-width: 860px) min(125vw, 68vh), 93vh';
