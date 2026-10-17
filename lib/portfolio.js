// Imperative animation layer for the portfolio page; runs once on the client.
let started = false;

export function initPortfolio() {
  if (started) return;
  started = true;
  document.documentElement.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

  // Run a render loop only while its element is on screen and the tab is visible.
  // A frame may return false to go idle (nothing left to animate); wake() resumes it.
  function visibilityLoop(element, frame) {
    let visible = false;
    let idle = false;
    let raf = 0;
    const tick = (time) => {
      if (frame(time) === false) { raf = 0; idle = true; return; }
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      const run = visible && !document.hidden && !idle;
      if (run && !raf) raf = requestAnimationFrame(tick);
      if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(element);
    document.addEventListener('visibilitychange', sync);
    return { wake() { if (idle) { idle = false; sync(); } } };
  }

  /* ---------- Preloader ---------- */
  let startHero = () => {};
  let finishLoading = () => {
    document.body.classList.add('loaded');
    document.body.classList.remove('is-loading');
    startHero();
  };
  if (reduceMotion) finishLoading();
  else {
    // The intro glides onto the hero title, so it must start at the top: don't let the
    // browser restore an old scroll position underneath it. A #section link is honoured
    // once the page is revealed.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const revealPage = finishLoading;
    finishLoading = () => {
      revealPage();
      const target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    };
    // Greetings swap one by one (letters falling into place), then the name intro plays.
    const preloader = document.querySelector('.preloader');
    const greet = preloader.querySelector('.preloader-greet');
    const greetings = ['Hello', 'నమస్కారం', 'नमस्ते', 'வணக்கம்', 'Hola', 'Bonjour', 'Ciao', 'こんにちは'];
    // Grapheme segmentation keeps Indic conjuncts (e.g. స్కా) together as one "letter".
    const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
    const letters = (word) => (segmenter ? [...segmenter.segment(word)].map((s) => s.segment) : [...word]);
    const LETTER_STEP = 45;
    let index = 0;
    let pageLoaded = document.readyState === 'complete';
    let greetingsDone = false;
    const showName = () => { runIntro().catch(finishLoading); };
    if (!pageLoaded) window.addEventListener('load', () => { pageLoaded = true; if (greetingsDone) showName(); });

    /* Name intro, after the reference: a dot drops and bounces under a spotlight,
       the I lands on it and tips, the other letters tumble in to spell SHIVASAI,
       the letters swap two at a time into PORTFOLIO, and the word glides into
       the hero title's exact position before the page is revealed. */
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const play = (el, frames, options) => el.animate(frames, { fill: 'forwards', ...options }).finished;
    async function runIntro() {
      await document.fonts?.ready;
      const stage = preloader.querySelector('.intro-stage');
      const heroTitle = document.querySelector('.hero-title');
      const fontSize = parseFloat(getComputedStyle(heroTitle).fontSize);
      stage.style.fontSize = `${fontSize}px`;
      stage.replaceChildren(...[...'SHIVASAI'].map((ch) => {
        const span = document.createElement('span');
        span.textContent = ch;
        return span;
      }));
      const spans = [...stage.children];
      const stem = spans[2];
      const ball = document.createElement('i');
      ball.className = 'intro-ball';
      const glow = document.createElement('b');
      glow.className = 'intro-glow';
      stage.append(glow, ball);

      // Rest the ball just under the I's baseline (Inter: baseline ≈ 0.864em at line-height 1).
      const r = fontSize * .075;
      const bx = stem.offsetLeft + stem.offsetWidth / 2 - fontSize * .02;
      const by = stem.offsetTop + fontSize * .864 + r + fontSize * .03;
      ball.style.cssText = `left:${bx - r}px;top:${by - r}px;width:${r * 2}px;height:${r * 2}px`;
      glow.style.left = `${bx}px`; glow.style.top = `${by}px`;

      preloader.classList.add('intro');
      await wait(250);

      // 1. Dot drops and bounces, squashing on each landing.
      const fall = window.innerHeight * .65;
      play(glow, [{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 300 });
      await play(ball, [
        { transform: `translateY(${-fall}px)`, opacity: 1, easing: 'cubic-bezier(.5,0,1,.6)' },
        { transform: 'translateY(0) scale(1.35,.65)', offset: .42, easing: 'cubic-bezier(0,.5,.5,1)' },
        { transform: `translateY(${-fall * .32}px) scale(.92,1.08)`, offset: .64, easing: 'cubic-bezier(.5,0,1,.6)' },
        { transform: 'translateY(0) scale(1.2,.8)', offset: .82, easing: 'cubic-bezier(0,.5,.5,1)' },
        { transform: `translateY(${-fall * .08}px)`, offset: .91, easing: 'cubic-bezier(.5,0,1,.6)' },
        { transform: 'translateY(0)', opacity: 1 },
      ], { duration: 1350 });

      // 2. The I stem lands on the dot, wobbles, then tips over.
      stem.style.transformOrigin = '50% 86%';
      await play(stem, [
        { transform: `translateY(${-fall}px)`, opacity: 1, easing: 'cubic-bezier(.55,0,1,.45)' },
        { transform: 'translateY(0) scaleY(.9)', offset: .7, easing: 'ease-out' },
        { transform: 'translateY(-4%) scaleY(1.03)', offset: .85 },
        { transform: 'none', opacity: 1 },
      ], { duration: 560 });
      await wait(120);
      await play(stem, [{ transform: 'none' }, { transform: 'rotate(34deg)' }], { duration: 380, easing: 'cubic-bezier(.5,0,.75,0)' });

      // 3. S and H tumble in from the left; H's landing knocks the I back upright.
      const left = spans.slice(0, 2);
      left.forEach((span, i) => play(span, [
        { transform: `translate(${-window.innerWidth * .55}px, ${-fontSize * .9}px) rotate(-220deg)`, opacity: 1 },
        { transform: 'translate(0, -6%) rotate(8deg)', offset: .78 },
        { transform: 'none', opacity: 1 },
      ], { duration: 720, delay: i * 110, easing: 'cubic-bezier(.2,.7,.3,1)' }));
      await wait(700);
      play(stem, [
        { transform: 'rotate(34deg)' },
        { transform: 'rotate(-9deg)', offset: .55 },
        { transform: 'rotate(3deg)', offset: .8 },
        { transform: 'none' },
      ], { duration: 520, easing: 'ease-out' });

      // 4. V A S A I drop in from above, one after another.
      const right = spans.slice(3);
      right.forEach((span, i) => play(span, [
        { transform: `translateY(${-fall}px) rotate(${i % 2 ? 24 : -24}deg)`, opacity: 1, easing: 'cubic-bezier(.55,0,1,.45)' },
        { transform: 'translateY(0) rotate(0) scaleY(.88)', offset: .66, easing: 'ease-out' },
        { transform: `translateY(-7%) rotate(${i % 2 ? -3 : 3}deg)`, offset: .84 },
        { transform: 'none', opacity: 1 },
      ], { duration: 620, delay: 200 + i * 110 }));
      await wait(200 + right.length * 110 + 650);

      // 5. The dot and spotlight fade away.
      play(ball, [{ opacity: 1 }, { opacity: 0, transform: 'scale(.4)' }], { duration: 300 });
      play(glow, [{ opacity: 1 }, { opacity: 0 }], { duration: 600 });
      await wait(380);

      // 6. Letters swap two at a time into PORTFOLIO.
      const target = 'PORTFOLIO';
      const swap = (span, ch) => play(span, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-30%) rotateX(80deg)', opacity: 0 }], { duration: 110, easing: 'ease-in' })
        .then(() => {
          span.textContent = ch;
          return play(span, [{ transform: 'translateY(30%) rotateX(-80deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 170, easing: 'ease-out' });
        });
      for (let i = 0; i < target.length; i += 2) {
        for (const j of [i, i + 1]) {
          if (j >= target.length) continue;
          let span = spans[j];
          if (!span) {
            span = document.createElement('span');
            span.style.opacity = '0';
            stage.insertBefore(span, glow);
            spans.push(span);
          }
          if (span.textContent !== target[j]) swap(span, target[j]);
        }
        await wait(280);
      }
      await wait(320);

      // 7. Glide onto the real hero title, then reveal the page beneath it.
      const from = stage.getBoundingClientRect();
      // Measure the title's text itself (the h1 box spans the full width).
      const range = document.createRange();
      range.selectNodeContents(heroTitle);
      const to = range.getBoundingClientRect();
      const scale = to.width / from.width;
      const fromBaseline = from.top + fontSize * .864 * scale;
      const toBaseline = heroTitle.getBoundingClientRect().top + fontSize * .7735; // h1 line-height .82
      const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
      const dy = toBaseline - fromBaseline + (from.height * (scale - 1)) / 2;
      stage.style.transformOrigin = '50% 50%';
      await play(stage, [{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(${scale})` }], { duration: 900, easing: 'cubic-bezier(.65,0,.35,1)' });
      preloader.classList.add('reveal');
      await wait(450);
      finishLoading();
    }

    const showGreeting = (word) => {
      greet.setAttribute('aria-label', word);
      greet.replaceChildren(...letters(word).map((ch, i) => {
        const span = document.createElement('span');
        span.textContent = ch;
        span.style.animationDelay = `${i * LETTER_STEP}ms`;
        return span;
      }));
      return letters(word).length;
    };
    const nextGreeting = () => {
      index += 1;
      if (index >= greetings.length) {
        greetingsDone = true;
        if (pageLoaded) showName();
        return;
      }
      const count = showGreeting(greetings[index]);
      setTimeout(nextGreeting, count * LETTER_STEP + 230);
    };
    const firstCount = showGreeting(greetings[0]);
    setTimeout(nextGreeting, firstCount * LETTER_STEP + 520);
  }

  /* ---------- Scroll: one listener, work batched into a single frame ---------- */
  const scrollTasks = [];
  let scrollRaf = 0;
  const onScrollFrame = (task) => { scrollTasks.push(task); task(); };
  window.addEventListener('scroll', () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; scrollTasks.forEach((task) => task()); });
  }, { passive: true });
  // Mobile URL bars resize the viewport height while scrolling; only a width
  // change is a real layout change worth rebuilding canvases for.
  const onWidthResize = (fn) => {
    let width = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      fn();
    });
  };

  /* ---------- Header: scrolled state, progress, active section ---------- */
  const header = document.querySelector('.site-header');
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  onScrollFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id === 'play' ? 'journey' : entry.target.id;
      navLinks.forEach((link) => link.classList.toggle('active', link.dataset.nav === id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main > section[id]').forEach((s) => sectionObserver.observe(s));

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const setMenu = (open) => {
    mobileMenu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('modal-open', open);
  };
  menuToggle.addEventListener('click', () => setMenu(mobileMenu.hidden));
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mobileMenu.hidden) { setMenu(false); menuToggle.focus(); } });

  /* ---------- Hero: starfield ---------- */
  const hero = document.querySelector('.hero');
  const starCanvas = document.querySelector('.hero-stars');
  const starCtx = starCanvas.getContext('2d');
  function paintStars() {
    const { width, height } = hero.getBoundingClientRect();
    const r = dpr();
    starCanvas.width = width * r; starCanvas.height = height * r;
    starCtx.setTransform(r, 0, 0, r, 0, 0);
    let seed = 7;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const count = Math.round(width * height / 900);
    for (let i = 0; i < count; i += 1) {
      const a = .15 + rand() * .7;
      starCtx.fillStyle = `rgba(225,228,240,${a})`;
      const s = rand() > .93 ? 1.6 : .9;
      starCtx.fillRect(rand() * width, rand() * height, s, s);
    }
  }

  /* ---------- Hero: particle portrait ---------- */
  const portraitCanvas = document.querySelector('.hero-portrait');
  const pctx = portraitCanvas.getContext('2d');
  const source = document.querySelector('#portrait-source');
  const tints = [[150, 175, 255], [205, 218, 255], [255, 255, 255], [118, 146, 228], [176, 196, 246], [235, 240, 255]];
  let particles = [];
  const palette = [];
  let tile = 6;
  let heroW = 0, heroH = 0;
  let assembled = false;
  let assembleStart = 0;
  const pointer = { x: -9999, y: -9999, active: false };
  let heroLoop = null;

  // Yield between build steps so no single task blocks the main thread for long.
  const yieldToMain = () => new Promise((resolve) => {
    if (globalThis.scheduler?.yield) globalThis.scheduler.yield().then(resolve);
    else setTimeout(resolve, 0);
  });
  let buildToken = 0;

  async function buildParticles() {
    if (!source.naturalWidth) return;
    const token = ++buildToken;
    const rect = hero.getBoundingClientRect();
    const W = rect.width, H = rect.height;

    const mobile = W <= 860;
    let size, x0, y0;
    if (mobile) {
      size = Math.min(W * 1.25, H * .68);
      x0 = (W - size) / 2; y0 = H - size;
    } else {
      size = H * .93;
      x0 = (W - size) / 2; y0 = H - size * .97;
    }
    const cell = mobile ? 3.6 : Math.max(4.2, size / 205);
    const cols = Math.floor(size / cell);
    // Downscale in steps so each tile averages its area instead of aliasing.
    let stepCanvas = source;
    let stepSize = source.naturalWidth;
    while (stepSize / 2 > cols) {
      const next = document.createElement('canvas');
      stepSize = Math.round(stepSize / 2);
      next.width = next.height = stepSize;
      const nctx = next.getContext('2d');
      nctx.imageSmoothingQuality = 'high';
      nctx.drawImage(stepCanvas, 0, 0, stepSize, stepSize);
      stepCanvas = next;
    }
    const sample = document.createElement('canvas');
    sample.width = cols; sample.height = cols;
    const sctx = sample.getContext('2d', { willReadFrequently: true });
    sctx.imageSmoothingQuality = 'high';
    sctx.drawImage(stepCanvas, 0, 0, cols, cols);
    const data = sctx.getImageData(0, 0, cols, cols).data;

    // Auto-levels: stretch the portrait's own luminance range so darker skin
    // tones keep their detail instead of collapsing into black tiles.
    const lums = [];
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 90) lums.push(data[i] * .2126 + data[i + 1] * .7152 + data[i + 2] * .0722);
    }
    lums.sort((a, b) => a - b);
    const lo = lums[Math.floor(lums.length * .02)] || 0;
    const hi = lums[Math.floor(lums.length * .985)] || 255;

    await yieldToMain();
    if (token !== buildToken) return;

    const nextGrid = [];
    const next = [];
    let seed = 42;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let row = 0; row < cols; row += 1) {
      if (row % 24 === 23) {
        await yieldToMain();
        if (token !== buildToken) return;
      }
      for (let col = 0; col < cols; col += 1) {
        const i = (row * cols + col) * 4;
        const alpha = data[i + 3] / 255;
        if (alpha < .35) continue;
        const lum = data[i] * .2126 + data[i + 1] * .7152 + data[i + 2] * .0722;
        // Levels + gamma lift for midtones, then a blue-white "glitter" tint like the reference.
        const level = Math.pow(clamp((lum - lo) / (hi - lo), 0, 1), .8);
        const tintIndex = Math.floor(rand() * tints.length);
        // Glitter jitter, then quantize so tiles share a small set of colors (fast batched drawing).
        const lit = Math.round(clamp(level * (.82 + rand() * .36), 0, 1) * 15);
        const bucket = tintIndex * 16 + lit;
        if (!palette[bucket]) {
          const lv = lit / 15;
          const tint = tints[tintIndex];
          const k = .07 + lv * 1.05;
          // Bright tiles lean toward white so highlights read cleanly.
          const w = lv * lv * .4;
          const ch = (c) => Math.round(Math.min(255, (c * (1 - w) + 255 * w) * k));
          palette[bucket] = `rgba(${ch(tint[0])},${ch(tint[1])},${ch(tint[2])},${.42 + lv * .58})`;
        }
        if (alpha < .5) continue;
        const tx = x0 + col * cell;
        const ty = y0 + row * cell;
        const p = {
          tx, ty,
          x: assembled ? tx : rand() * W,
          y: assembled ? ty : rand() * H,
          vx: 0, vy: 0,
          delay: rand() * 1100,
          bright: level > .7,
          bucket,
          moving: false,
        };
        next.push(p);
        nextGrid[row * cols + col] = p;
      }
    }
    next.sort((a, b) => a.bucket - b.bucket);
    await yieldToMain();
    if (token !== buildToken) return;

    // Commit: resize the visible canvas only now, so it never shows a half-built state.
    heroW = W; heroH = H; tile = cell;
    const r = dpr();
    portraitCanvas.width = W * r; portraitCanvas.height = H * r;
    pctx.setTransform(r, 0, 0, r, 0, 0);
    buildPhotoLayer(size, x0, y0);
    particles = next;
    grid = nextGrid;
    bright = particles.filter((p) => p.bright);
    gridInfo = { cols, x0, y0 };
    displaced.clear();
    if (assembled || reduceMotion) { settle(); if (reduceMotion) drawPortrait(0); }
    heroLoop?.wake();
  }

  // Once assembled, the resting portrait is cached as one bitmap; only tiles the
  // pointer disturbs are simulated and drawn individually.
  const cache = document.createElement('canvas');
  const cctx = cache.getContext('2d');
  let grid = [];
  let gridInfo = null;
  let bright = [];
  const displaced = new Set();
  let settled = false;
  function settle() {
    const r = dpr();
    cache.width = portraitCanvas.width; cache.height = portraitCanvas.height;
    cctx.setTransform(r, 0, 0, r, 0, 0);
    const s = tile - .8;
    let current = -1;
    particles.forEach((p) => {
      // Stragglers (or tiles under the pointer) keep flying home on their own
      // above the photo instead of snapping into place.
      if ((p.tx - p.x) ** 2 + (p.ty - p.y) ** 2 > 2) {
        p.moving = true; displaced.add(p); cutPhotoCell(p);
        return;
      }
      p.x = p.tx; p.y = p.ty; p.vx = p.vy = 0; p.moving = false;
      if (p.bucket !== current) { current = p.bucket; cctx.fillStyle = palette[current]; }
      cctx.fillRect(p.tx, p.ty, s, s);
    });
    assembled = true;
    settled = true;
  }

  // Once the tiles settle they dissolve into this: the photo itself at full
  // device resolution, toned to the same blue-silver as the tiles.
  let photoLayer = null;
  let photoBox = null;
  const TONE = [[5, 8, 22], [70, 88, 156], [178, 192, 236], [248, 250, 255]];
  function buildPhotoLayer(size, x0, y0) {
    const r = dpr();
    const px = Math.round(size * r);
    photoLayer = document.createElement('canvas');
    photoLayer.width = photoLayer.height = px;
    const c = photoLayer.getContext('2d', { willReadFrequently: true });
    c.imageSmoothingQuality = 'high';
    c.drawImage(source, 0, 0, px, px);
    const img = c.getImageData(0, 0, px, px);
    const d = img.data;
    // Levels from the subject's own luminance histogram, so darker skin keeps its detail.
    const hist = new Uint32Array(256);
    let total = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 200) continue;
      hist[Math.round(d[i] * .2126 + d[i + 1] * .7152 + d[i + 2] * .0722)] += 1;
      total += 1;
    }
    const percentile = (q) => { let sum = 0; for (let v = 0; v < 256; v += 1) { sum += hist[v]; if (sum >= total * q) return v; } return 255; };
    const lo = percentile(.01), hi = Math.max(lo + 1, percentile(.995));
    // Tone ramp as a lookup table: levels, a midtone lift, then shadow → navy → silver → white.
    const lut = new Uint8ClampedArray(256 * 3);
    for (let v = 0; v < 256; v += 1) {
      const t = Math.pow(clamp((v - lo) / (hi - lo), 0, 1), .78) * (TONE.length - 1);
      const k = Math.min(TONE.length - 2, Math.floor(t));
      const f = t - k;
      for (let ch = 0; ch < 3; ch += 1) lut[v * 3 + ch] = TONE[k][ch] + (TONE[k + 1][ch] - TONE[k][ch]) * f;
    }
    for (let i = 0; i < d.length; i += 4) {
      if (!d[i + 3]) continue;
      const lum = d[i] * .2126 + d[i + 1] * .7152 + d[i + 2] * .0722;
      const v = Math.round(lum) * 3;
      // A trace of the photo's own colour keeps skin from reading as flat monochrome.
      d[i] = lut[v] + (d[i] - lum) * .16;
      d[i + 1] = lut[v + 1] + (d[i + 1] - lum) * .16;
      d[i + 2] = lut[v + 2] + (d[i + 2] - lum) * .16;
    }
    c.putImageData(img, 0, 0);
    // Hero-sized working copy: cells are cut out of it wherever tiles are
    // displaced, so a swirl opens onto empty space rather than a ghost photo.
    // Everything here works in whole device pixels (photo placed unscaled at an
    // integer offset), so a cut cell restores exactly, with no hairline seams.
    photoBox = { x: Math.round(x0 * r), y: Math.round(y0 * r) };
    photoCache.width = portraitCanvas.width; photoCache.height = portraitCanvas.height;
    photoCtx.drawImage(photoLayer, photoBox.x, photoBox.y);
  }
  const photoCache = document.createElement('canvas');
  const photoCtx = photoCache.getContext('2d');
  const deviceCell = (p) => {
    const r = dpr();
    const x = Math.floor((p.tx - .1) * r), y = Math.floor((p.ty - .1) * r);
    return [x, y, Math.ceil((p.tx - .1 + tile) * r) - x, Math.ceil((p.ty - .1 + tile) * r) - y];
  };
  function cutPhotoCell(p) {
    photoCtx.clearRect(...deviceCell(p));
  }
  function restorePhotoCell(p) {
    const [x, y, w, h] = deviceCell(p);
    photoCtx.clearRect(x, y, w, h);
    photoCtx.drawImage(photoLayer, x - photoBox.x, y - photoBox.y, w, h, x, y, w, h);
  }

  let photoAlpha = 0;
  let lastFrame = 0;
  const TILE_REST = .1;
  function drawPortrait(time) {
    if (!particles.length) return;
    pctx.clearRect(0, 0, heroW, heroH);
    const since = assembleStart ? time - assembleStart : -1;
    const radius = heroW <= 860 ? 70 : 115;
    const s = tile - .8;
    // Photo cross-fades in over ~350ms the moment the tiles land.
    const dt = lastFrame ? Math.min(64, time - lastFrame) : 16;
    lastFrame = time;
    photoAlpha = settled ? (reduceMotion ? 1 : Math.min(1, photoAlpha + dt / 350)) : 0;
    if (photoLayer && photoAlpha > .005) {
      pctx.globalAlpha = photoAlpha;
      pctx.drawImage(photoCache, 0, 0, heroW, heroH);
      pctx.globalAlpha = 1;
    }
    const push = (p) => {
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 >= radius * radius || d2 < .01) return false;
      const d = Math.sqrt(d2);
      const f = (1 - d / radius) * 3.2;
      p.vx += (dx / d) * f - (dy / d) * f * .7;
      p.vy += (dy / d) * f + (dx / d) * f * .7;
      return true;
    };

    if (!settled) {
      // Assembly: every tile flies in from its scattered start.
      let currentBucket = -1;
      let away = 0;
      for (let n = 0; n < particles.length; n += 1) {
        const p = particles[n];
        if (since >= 0 && since > p.delay) {
          const strength = clamp((since - p.delay) / 900, 0, 1) * .06;
          p.vx += (p.tx - p.x) * strength;
          p.vy += (p.ty - p.y) * strength;
        } else {
          p.vx += (Math.random() - .5) * .08;
          p.vy += (Math.random() - .5) * .08;
        }
        if (pointer.active) push(p);
        p.vx *= .84; p.vy *= .84;
        p.x += p.vx; p.y += p.vy;
        const dx = p.tx - p.x, dy = p.ty - p.y;
        if (dx * dx + dy * dy > 2) away += 1;
        if (p.bucket !== currentBucket) { currentBucket = p.bucket; pctx.fillStyle = palette[currentBucket]; }
        pctx.fillRect(p.x, p.y, s, s);
      }
      // Lock in as soon as the picture has formed (all but a few stragglers within
      // ~1.4px of home); settle() lets the stragglers finish on their own.
      if (since > 0 && (away <= particles.length * .01 || since > 4000)) settle();
    } else {
      // Resting: lift tiles near the pointer out of the cached bitmap.
      if (pointer.active && gridInfo) {
        const { cols, x0, y0 } = gridInfo;
        const c0 = Math.max(0, Math.floor((pointer.x - radius - x0) / tile));
        const c1 = Math.min(cols - 1, Math.ceil((pointer.x + radius - x0) / tile));
        const r0 = Math.max(0, Math.floor((pointer.y - radius - y0) / tile));
        const r1 = Math.min(cols - 1, Math.ceil((pointer.y + radius - y0) / tile));
        for (let row = r0; row <= r1; row += 1) {
          for (let col = c0; col <= c1; col += 1) {
            const p = grid[row * cols + col];
            if (!p || p.moving) continue;
            if (push(p)) { p.moving = true; displaced.add(p); cctx.clearRect(p.tx - .1, p.ty - .1, tile, tile); cutPhotoCell(p); }
          }
        }
      }
      // The resting tiles fade out as the photo fades in; only a whisper of the grid stays.
      pctx.globalAlpha = 1 - photoAlpha * (1 - TILE_REST);
      pctx.drawImage(cache, 0, 0, heroW, heroH);
      pctx.globalAlpha = 1;
      let currentBucket = -1;
      displaced.forEach((p) => {
        if (pointer.active) push(p);
        p.vx += (p.tx - p.x) * .075;
        p.vy += (p.ty - p.y) * .075;
        p.vx *= .84; p.vy *= .84;
        p.x += p.vx; p.y += p.vy;
        if (Math.abs(p.tx - p.x) < .3 && Math.abs(p.ty - p.y) < .3 && Math.abs(p.vx) + Math.abs(p.vy) < .2) {
          // Back home: paint it into the cache again.
          p.x = p.tx; p.y = p.ty; p.vx = p.vy = 0; p.moving = false;
          displaced.delete(p);
          cctx.fillStyle = palette[p.bucket];
          cctx.fillRect(p.tx, p.ty, s, s);
          restorePhotoCell(p);
          currentBucket = -1;
          return;
        }
        if (p.bucket !== currentBucket) { currentBucket = p.bucket; pctx.fillStyle = palette[currentBucket]; }
        pctx.fillRect(p.x, p.y, s, s);
      });
    }
    // Twinkle only while assembling; the finished portrait stays perfectly still.
    if (!settled && bright.length) {
      pctx.fillStyle = 'rgba(255,255,255,.9)';
      for (let t = 0; t < 30; t += 1) {
        const p = bright[(Math.random() * bright.length) | 0];
        pctx.fillRect(p.x, p.y, s, s);
      }
    }
    // Nothing moving and nothing fading: stop rendering until the pointer returns.
    if (settled && !displaced.size && !pointer.active && photoAlpha === 1) return false;
    return true;
  }

  const layoutHero = () => { paintStars(); buildParticles(); if (reduceMotion) drawPortrait(0); };
  // srcset may swap in a sharper file later (resize, zoom), so rebuild on every load.
  source.addEventListener('load', layoutHero);
  if (source.complete && source.naturalWidth) layoutHero();
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // The hero is 100svh, so a phone's URL bar showing/hiding leaves it unchanged: skip the rebuild.
      const { width, height } = hero.getBoundingClientRect();
      if (width !== heroW || height !== heroH) layoutHero();
    }, 150);
  });

  startHero = () => {
    if (reduceMotion) { assembled = true; drawPortrait(0); return; }
    assembleStart = performance.now();
    heroLoop = visibilityLoop(hero, drawPortrait);
  };

  hero.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
    pointer.x = e.clientX - rect.left; pointer.y = e.clientY - rect.top; pointer.active = true;
    heroLoop?.wake();
  });
  hero.addEventListener('pointerleave', () => { pointer.active = false; });

  /* ---------- About: word-by-word reveal ---------- */
  const reveal = document.querySelector('.word-reveal');
  const words = [];
  (function splitWords(node) {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const span = document.createElement('span');
          span.className = 'w'; span.textContent = part;
          words.push(span); frag.append(span);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) splitWords(child);
    });
  })(reveal);
  const updateWords = () => {
    const rect = reveal.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = clamp((vh * .85 - rect.top) / (rect.height + vh * .3), 0, 1);
    const lit = Math.ceil(progress * words.length * 1.05);
    if (lit === litWords) return;
    words.forEach((w, i) => { if ((i < lit) !== (i < litWords)) w.classList.toggle('on', i < lit); });
    litWords = lit;
  };
  let litWords = 0;
  onScrollFrame(updateWords);

  /* ---------- Marquee: duplicate items for a seamless loop ---------- */
  document.querySelectorAll('.marquee-track').forEach((track) => {
    [...track.children].forEach((li) => { const clone = li.cloneNode(true); clone.setAttribute('aria-hidden', 'true'); track.append(clone); });
  });

  /* ---------- Fades and line reveals ---------- */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('in'); fadeObserver.unobserve(entry.target); } });
  }, { threshold: .15 });
  document.querySelectorAll('[data-fade], [data-lines]').forEach((el) => fadeObserver.observe(el));

  /* ---------- eHub project: video stage and spotlight cards ---------- */
  const ehub = document.querySelector('.ehub');
  const screen = ehub.querySelector('.ehub-screen');
  const loop = ehub.querySelector('.ehub-loop');
  const player = ehub.querySelector('.ehub-player');
  const tabs = [...ehub.querySelectorAll('.ehub-tab')];
  const nowLabel = ehub.querySelector('.ehub-now');
  const saveData = navigator.connection?.saveData;
  let current = 0;

  // The silent loop is only fetched near the viewport and only plays while visible.
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && !player.paused) player.pause();
  }).observe(ehub);
  if (!reduceMotion && !saveData) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!loop.src) loop.src = loop.dataset.src;
        if (!screen.classList.contains('playing')) loop.play().catch(() => {});
      } else loop.pause();
    }, { rootMargin: '200px 0px' }).observe(screen);
  }

  const playVideo = (i) => {
    const tab = tabs[i];
    current = i;
    tabs.forEach((t, j) => t.setAttribute('aria-pressed', String(j === i)));
    nowLabel.textContent = tab.dataset.label;
    if (!player.src.endsWith(tab.dataset.src)) { player.poster = tab.dataset.poster; player.src = tab.dataset.src; }
    player.hidden = false; player.controls = true;
    screen.classList.add('playing');
    loop.pause();
    player.play().catch(() => {});
  };
  ehub.querySelector('.ehub-play').addEventListener('click', () => playVideo(current));
  tabs.forEach((tab, i) => tab.addEventListener('click', () => playVideo(i)));
  player.addEventListener('ended', () => {
    screen.classList.remove('playing');
    player.hidden = true; player.controls = false;
    if (loop.src && !reduceMotion) loop.play().catch(() => {});
  });

  // Spotlight + tilt follow the cursor, batched to one write per frame.
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    ehub.querySelectorAll('.ehub-card').forEach((card) => {
      let raf = 0;
      card.addEventListener('pointermove', (e) => {
        if (raf) return;
        const { clientX, clientY } = e;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = card.getBoundingClientRect();
          const x = (clientX - r.left) / r.width;
          const y = (clientY - r.top) / r.height;
          card.style.setProperty('--mx', `${x * 100}%`);
          card.style.setProperty('--my', `${y * 100}%`);
          card.classList.add('tilting');
          card.style.transform = `perspective(900px) rotateX(${(.5 - y) * 6}deg) rotateY(${(x - .5) * 8}deg) translateY(-4px)`;
        });
      });
      card.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); raf = 0; card.classList.remove('tilting'); card.style.transform = ''; });
    });
  }

  /* ---------- Learning rows ---------- */
  const rows = [...document.querySelectorAll('.service-row')];
  rows.forEach((row) => {
    row.querySelector('.service-toggle').addEventListener('click', () => {
      const open = !row.classList.contains('open');
      rows.forEach((other) => { other.classList.remove('open'); other.querySelector('.service-toggle').setAttribute('aria-expanded', 'false'); });
      row.classList.toggle('open', open);
      row.querySelector('.service-toggle').setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Certificate dialog ---------- */
  const certs = [
    { title: 'Build Your Own Static Website', img: '/images/cert-static-1800.webp', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7452620065113264129/' },
    { title: 'Programming Foundations with Python', img: '/images/cert-python-1800.webp', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7452618755001716736/' },
    { title: 'Build Your Own Dynamic Web Application', img: '/images/cert-dynamic-1800.webp', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7452619777413595136/' },
    { title: 'Build Your Own Responsive Website', img: '/images/cert-responsive-1800.webp', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7452619280371818496/' },
    { title: 'Responsive Web Design using Flexbox', img: '/images/cert-flexbox-1800.webp', url: 'https://certificates.ccbp.in/academy/responsive-web-design-using-flexbox?id=NTKXWLUOLU', linkText: 'Verify certificate' },
  ];
  const dialog = document.querySelector('#cert-dialog');
  document.querySelectorAll('[data-cert]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cert = certs[Number(btn.dataset.cert)];
      dialog.querySelector('#cert-dialog-title').textContent = cert.title;
      const img = dialog.querySelector('#cert-dialog-img');
      img.src = cert.img; img.alt = `Shivasai Aillaboina's ${cert.title} certificate`;
      const link = dialog.querySelector('#cert-dialog-link');
      link.href = cert.url;
      link.firstChild.nodeValue = `${cert.linkText || 'View original LinkedIn post'} `;
      dialog.showModal();
      document.body.classList.add('modal-open');
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));

  /* ---------- Journey: scroll-driven horizontal shelf ---------- */
  const journey = document.querySelector('.journey');
  const shelf = journey.querySelector('.journey-shelf');
  const track = journey.querySelector('.journey-track');
  const cards = [...track.children];
  const dots = journey.querySelector('.journey-dots');
  cards.forEach(() => dots.append(document.createElement('i')));
  const dotEls = [...dots.children];
  let overflow = 0;
  const sizeJourney = () => {
    overflow = Math.max(0, track.scrollWidth - shelf.clientWidth + 36);
    // svh, matching the sticky panel, stays fixed while a phone's URL bar slides in and out.
    journey.style.height = `calc(100svh + ${overflow}px)`;
    updateJourney();
  };
  function updateJourney() {
    const top = journey.getBoundingClientRect().top;
    const p = overflow ? clamp(-top / overflow, 0, 1) : 0;
    track.style.transform = `translate3d(${-p * overflow}px,0,0)`;
    const active = Math.round(p * (cards.length - 1));
    cards.forEach((c, i) => c.classList.toggle('active', i === active));
    dotEls.forEach((d, i) => d.classList.toggle('on', i === active));
    journey.querySelector('.journey-count').textContent = `${active + 1} / ${cards.length}`;
    journey.querySelector('.journey-p').textContent = `P ${p.toFixed(2)}`;
    journey.style.setProperty('--jp', p.toFixed(3));
  }
  onScrollFrame(updateJourney);
  onWidthResize(sizeJourney);
  sizeJourney();
  document.fonts?.ready.then(sizeJourney);

  /* ---------- Play: HELLO WORLD breakout ---------- */
  const game = document.querySelector('.breakout');
  const gctx = game.getContext('2d');
  const playBtn = document.querySelector('.play-btn');
  const status = document.querySelector('.play-status');
  const GW = 1040, GH = 585;
  const glyphs = {
    H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
    E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
    L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
    O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
    W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
    R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
    D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  };
  const cell = 18;
  let bricks = [];
  const paddle = { w: 200, h: 12, x: GW / 2 - 100, y: GH - 70 };
  const ball = { x: GW / 2, y: GH - 100, r: 9, vx: 0, vy: 0 };
  let playing = false;
  let gameRaf = 0;
  let lastTime = 0;

  function buildBricks() {
    bricks = [];
    ['HELLO', 'WORLD'].forEach((word, line) => {
      const width = (word.length * 6 - 1) * cell;
      const startX = (GW - width) / 2;
      const startY = 40 + line * 10 * cell;
      [...word].forEach((ch, li) => {
        glyphs[ch].forEach((bits, r) => {
          [...bits].forEach((bit, c) => {
            if (bit === '1') bricks.push({ x: startX + (li * 6 + c) * cell, y: startY + r * cell, alive: true });
          });
        });
      });
    });
  }
  function resetBall() {
    ball.x = paddle.x + paddle.w / 2; ball.y = paddle.y - 30; ball.vx = 0; ball.vy = 0;
  }
  function sizeGame() {
    const r = dpr();
    game.width = GW * r; game.height = GH * r;
    gctx.setTransform(r, 0, 0, r, 0, 0);
    drawGame();
  }
  function drawGame() {
    gctx.clearRect(0, 0, GW, GH);
    gctx.fillStyle = '#efebe4';
    bricks.forEach((b) => { if (b.alive) gctx.fillRect(b.x, b.y, cell - 4, cell - 4); });
    gctx.beginPath(); gctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); gctx.fill();
    gctx.beginPath(); gctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6); gctx.fill();
  }
  function stepGame(time) {
    const dt = Math.min(2, (time - lastTime) / 16.67 || 1);
    lastTime = time;
    ball.x += ball.vx * dt; ball.y += ball.vy * dt;
    if (ball.x < ball.r || ball.x > GW - ball.r) { ball.vx *= -1; ball.x = clamp(ball.x, ball.r, GW - ball.r); }
    if (ball.y < ball.r) { ball.vy = Math.abs(ball.vy); }
    if (ball.vy > 0 && ball.y + ball.r >= paddle.y && ball.y - ball.r <= paddle.y + paddle.h && ball.x >= paddle.x - ball.r && ball.x <= paddle.x + paddle.w + ball.r) {
      const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
      const speed = Math.hypot(ball.vx, ball.vy);
      ball.vx = speed * Math.sin(hit * 1.05); ball.vy = -Math.abs(speed * Math.cos(hit * 1.05));
    }
    for (const b of bricks) {
      if (!b.alive) continue;
      const bs = cell - 4;
      if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + bs && ball.y + ball.r > b.y && ball.y - ball.r < b.y + bs) {
        b.alive = false;
        const overlapX = Math.min(ball.x + ball.r - b.x, b.x + bs - (ball.x - ball.r));
        const overlapY = Math.min(ball.y + ball.r - b.y, b.y + bs - (ball.y - ball.r));
        if (overlapX < overlapY) ball.vx *= -1; else ball.vy *= -1;
        break;
      }
    }
    drawGame();
    if (ball.y > GH + ball.r) return endGame('Missed! Press Play to try again.');
    if (bricks.every((b) => !b.alive)) return endGame('Cleared! Hello, world — it still ships.', true);
    gameRaf = requestAnimationFrame(stepGame);
  }
  function endGame(message, won) {
    playing = false; cancelAnimationFrame(gameRaf);
    status.textContent = message;
    playBtn.textContent = won ? 'AGAIN' : 'PLAY';
    if (won) buildBricks();
    resetBall(); drawGame();
  }
  playBtn.addEventListener('click', () => {
    if (playing) return;
    if (bricks.every((b) => !b.alive)) buildBricks();
    playing = true; status.textContent = '';
    playBtn.textContent = 'PLAY';
    resetBall();
    ball.vx = 4 * (Math.random() > .5 ? 1 : -1); ball.vy = -6.5;
    lastTime = performance.now();
    gameRaf = requestAnimationFrame(stepGame);
    game.focus?.();
  });
  const movePaddle = (clientX) => {
    const rect = game.getBoundingClientRect();
    paddle.x = clamp((clientX - rect.left) / rect.width * GW - paddle.w / 2, 0, GW - paddle.w);
    if (!playing) { resetBall(); drawGame(); }
  };
  game.addEventListener('pointermove', (e) => movePaddle(e.clientX));
  game.addEventListener('pointerdown', (e) => movePaddle(e.clientX));
  document.addEventListener('keydown', (e) => {
    if (!playing || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    e.preventDefault();
    paddle.x = clamp(paddle.x + (e.key === 'ArrowLeft' ? -40 : 40), 0, GW - paddle.w);
  });
  buildBricks(); resetBall(); sizeGame();

  /* ---------- Contact: drifting smoke ---------- */
  const contact = document.querySelector('.contact');
  const smoke = document.querySelector('.smoke');
  const sctx = smoke.getContext('2d');
  let wisps = [];
  const sizeSmoke = () => {
    const rect = contact.getBoundingClientRect();
    smoke.width = Math.ceil(rect.width / 3); smoke.height = Math.ceil(rect.height / 3);
    sctx.fillStyle = '#050505'; sctx.fillRect(0, 0, smoke.width, smoke.height);
    wisps = Array.from({ length: 70 }, () => ({ x: Math.random() * smoke.width, y: Math.random() * smoke.height, life: Math.random() * 300 }));
  };
  sizeSmoke();
  let smokeBox = `${contact.offsetWidth}x${contact.offsetHeight}`;
  window.addEventListener('resize', () => {
    const box = `${contact.offsetWidth}x${contact.offsetHeight}`;
    if (box !== smokeBox) { smokeBox = box; sizeSmoke(); }
  });
  const flow = (x, y, t) => Math.sin(x * .018 + t) * Math.cos(y * .021 - t * .7) * Math.PI * 2 + Math.sin((x + y) * .006 + t * .3) * 2;
  const drawSmoke = (time) => {
    const t = time * .00012;
    sctx.fillStyle = 'rgba(5,5,5,.035)';
    sctx.fillRect(0, 0, smoke.width, smoke.height);
    sctx.strokeStyle = 'rgba(200,200,205,.07)';
    sctx.lineWidth = 2.2;
    sctx.beginPath();
    wisps.forEach((w) => {
      const a = flow(w.x, w.y, t);
      const nx = w.x + Math.cos(a) * .9;
      const ny = w.y + Math.sin(a) * .9;
      sctx.moveTo(w.x, w.y); sctx.lineTo(nx, ny);
      w.x = nx; w.y = ny; w.life -= 1;
      if (w.life < 0 || nx < 0 || ny < 0 || nx > smoke.width || ny > smoke.height) {
        w.x = Math.random() * smoke.width; w.y = Math.random() * smoke.height; w.life = 200 + Math.random() * 300;
      }
    });
    sctx.stroke();
  };
  if (reduceMotion) { for (let i = 0; i < 400; i += 1) drawSmoke(i * 16); } else visibilityLoop(contact, drawSmoke);

  document.querySelector('#year').textContent = new Date().getFullYear();
}
