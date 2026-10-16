'use strict';

(() => {
  document.documentElement.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

  // Run a render loop only while its element is on screen and the tab is visible.
  function visibilityLoop(element, frame) {
    let visible = false;
    let raf = 0;
    const tick = (time) => { frame(time); raf = requestAnimationFrame(tick); };
    const sync = () => {
      const run = visible && !document.hidden;
      if (run && !raf) raf = requestAnimationFrame(tick);
      if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(element);
    document.addEventListener('visibilitychange', sync);
  }

  /* ---------- Preloader ---------- */
  let startHero = () => {};
  const finishLoading = () => {
    document.body.classList.add('loaded');
    document.body.classList.remove('is-loading');
    startHero();
  };
  if (reduceMotion) finishLoading();
  else {
    // Greetings swap one by one, then the name drops in letter by letter.
    const preloader = document.querySelector('.preloader');
    const greet = preloader.querySelector('.preloader-greet span');
    const greetings = ['Hello', 'నమస్కారం', 'नमस्ते', 'வணக்கம்', 'Hola', 'Bonjour', 'Ciao', 'こんにちは', 'Hello'];
    let index = 0;
    let greetEl = greet;
    let pageLoaded = false;
    let greetingsDone = false;
    window.addEventListener('load', () => { pageLoaded = true; if (greetingsDone) showName(); });
    const showName = () => {
      preloader.classList.add('name');
      setTimeout(finishLoading, 1300);
    };
    const nextGreeting = () => {
      index += 1;
      if (index >= greetings.length) {
        greetingsDone = true;
        if (pageLoaded) showName();
        return;
      }
      // Restart the entry animation for each new word.
      const fresh = greet.cloneNode();
      fresh.textContent = greetings[index];
      greetEl.replaceWith(fresh);
      greetEl = fresh;
      setTimeout(nextGreeting, index === 1 ? 420 : 210);
    };
    setTimeout(nextGreeting, 650);
  }

  /* ---------- Header: scrolled state, progress, active section ---------- */
  const header = document.querySelector('.site-header');
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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

  function buildParticles() {
    if (!source.naturalWidth) return;
    const rect = hero.getBoundingClientRect();
    heroW = rect.width; heroH = rect.height;
    const r = dpr();
    portraitCanvas.width = heroW * r; portraitCanvas.height = heroH * r;
    pctx.setTransform(r, 0, 0, r, 0, 0);

    const mobile = heroW <= 860;
    let size, x0, y0;
    if (mobile) {
      size = Math.min(heroW * 1.25, heroH * .68);
      x0 = (heroW - size) / 2; y0 = heroH - size;
    } else {
      size = heroH * .93;
      x0 = (heroW - size) / 2; y0 = heroH - size * .97;
    }
    tile = mobile ? 3.6 : Math.max(4.2, size / 205);
    const cols = Math.floor(size / tile);
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

    buildPhotoLayer(size, x0, y0);

    grid = [];
    particles = [];
    let seed = 42;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let row = 0; row < cols; row += 1) {
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
        const tx = x0 + col * tile;
        const ty = y0 + row * tile;
        const p = {
          tx, ty,
          x: assembled ? tx : rand() * heroW,
          y: assembled ? ty : rand() * heroH,
          vx: 0, vy: 0,
          delay: rand() * 1100,
          bright: level > .7,
          bucket,
          moving: false,
        };
        particles.push(p);
        grid[row * cols + col] = p;
      }
    }
    particles.sort((a, b) => a.bucket - b.bucket);
    bright = particles.filter((p) => p.bright);
    gridInfo = { cols, x0, y0 };
    displaced.clear();
    if (assembled || reduceMotion) settle();
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
      p.x = p.tx; p.y = p.ty; p.vx = p.vy = 0; p.moving = false;
      if (p.bucket !== current) { current = p.bucket; cctx.fillStyle = palette[current]; }
      cctx.fillRect(p.tx, p.ty, s, s);
    });
    assembled = true;
    settled = true;
  }

  // A crisp, monochrome-blue copy of the photo sits faintly beneath the tiles
  // once they settle, adding fine detail the tile grid alone can't carry.
  let photoLayer = null;
  let photoBox = null;
  function buildPhotoLayer(size, x0, y0) {
    const r = dpr();
    const px = Math.round(size * r);
    photoLayer = document.createElement('canvas');
    photoLayer.width = photoLayer.height = px;
    const c = photoLayer.getContext('2d');
    c.imageSmoothingQuality = 'high';
    c.filter = 'grayscale(1) contrast(1.25) brightness(1.35)';
    c.drawImage(source, 0, 0, px, px);
    c.filter = 'none';
    c.globalCompositeOperation = 'multiply';
    c.fillStyle = '#9fb3ff';
    c.fillRect(0, 0, px, px);
    c.globalCompositeOperation = 'destination-in';
    c.drawImage(source, 0, 0, px, px);
    photoBox = { x: x0, y: y0, size };
  }

  let photoAlpha = 0;
  function drawPortrait(time) {
    if (!particles.length) return;
    pctx.clearRect(0, 0, heroW, heroH);
    const since = assembleStart ? time - assembleStart : -1;
    const radius = heroW <= 860 ? 70 : 115;
    const s = tile - .8;
    const photoTarget = reduceMotion || since > 1600 ? .3 : 0;
    photoAlpha += (photoTarget - photoAlpha) * .04;
    if (photoLayer && photoAlpha > .005) {
      pctx.globalAlpha = photoAlpha;
      pctx.drawImage(photoLayer, photoBox.x, photoBox.y, photoBox.size, photoBox.size);
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
        if (p.bucket !== currentBucket) { currentBucket = p.bucket; pctx.fillStyle = palette[currentBucket]; }
        pctx.fillRect(p.x, p.y, s, s);
      }
      if (since > 2600) settle();
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
            if (push(p)) { p.moving = true; displaced.add(p); cctx.clearRect(p.tx - .1, p.ty - .1, tile, tile); }
          }
        }
      }
      pctx.drawImage(cache, 0, 0, heroW, heroH);
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
          currentBucket = -1;
          return;
        }
        if (p.bucket !== currentBucket) { currentBucket = p.bucket; pctx.fillStyle = palette[currentBucket]; }
        pctx.fillRect(p.x, p.y, s, s);
      });
    }
    // Twinkle: a few bright tiles flash white each frame.
    if (bright.length) {
      pctx.fillStyle = 'rgba(255,255,255,.9)';
      for (let t = 0; t < 30; t += 1) {
        const p = bright[(Math.random() * bright.length) | 0];
        pctx.fillRect(p.x, p.y, s, s);
      }
    }
  }

  const layoutHero = () => { paintStars(); buildParticles(); if (reduceMotion) drawPortrait(0); };
  if (source.complete && source.naturalWidth) layoutHero(); else source.addEventListener('load', layoutHero);
  let resizeTimer = 0;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(layoutHero, 150); });

  startHero = () => {
    if (reduceMotion) { assembled = true; drawPortrait(0); return; }
    assembleStart = performance.now();
    visibilityLoop(hero, drawPortrait);
  };

  hero.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
    pointer.x = e.clientX - rect.left; pointer.y = e.clientY - rect.top; pointer.active = true;
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
    words.forEach((w, i) => w.classList.toggle('on', i < lit));
  };
  window.addEventListener('scroll', updateWords, { passive: true });
  updateWords();

  /* ---------- Marquee: duplicate items for a seamless loop ---------- */
  document.querySelectorAll('.marquee-track').forEach((track) => {
    [...track.children].forEach((li) => { const clone = li.cloneNode(true); clone.setAttribute('aria-hidden', 'true'); track.append(clone); });
  });

  /* ---------- Fades and line reveals ---------- */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('in'); fadeObserver.unobserve(entry.target); } });
  }, { threshold: .15 });
  document.querySelectorAll('[data-fade], [data-lines]').forEach((el) => fadeObserver.observe(el));

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
    { title: 'Build Your Own Static Website', img: 'assets/cert-static.jpg', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7452620065113264129/' },
    { title: 'Programming Foundations with Python', img: 'assets/cert-python.jpg', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7452618755001716736/' },
    { title: 'Build Your Own Dynamic Web Application', img: 'assets/cert-dynamic.jpg', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7452619777413595136/' },
    { title: 'Build Your Own Responsive Website', img: 'assets/cert-responsive.jpg', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7452619280371818496/' },
  ];
  const dialog = document.querySelector('#cert-dialog');
  document.querySelectorAll('[data-cert]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cert = certs[Number(btn.dataset.cert)];
      dialog.querySelector('#cert-dialog-title').textContent = cert.title;
      const img = dialog.querySelector('#cert-dialog-img');
      img.src = cert.img; img.alt = `Shivasai Aillaboina's ${cert.title} certificate`;
      dialog.querySelector('#cert-dialog-link').href = cert.url;
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
    journey.style.height = `${window.innerHeight + overflow}px`;
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
  window.addEventListener('scroll', updateJourney, { passive: true });
  window.addEventListener('resize', sizeJourney);
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
  window.addEventListener('resize', sizeSmoke);
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
})();
