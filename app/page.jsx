import PortfolioEffects from '../components/PortfolioEffects';

const LINKEDIN = 'https://www.linkedin.com/in/shivasai-aillaboina-576900318/';
const EMAIL = 'saillaboina@gmail.com';
const GITHUB = 'https://github.com/Shivasai-Git';
const EHUB_LIVE = 'https://ehub-64.vercel.app/';

const NAV = [
  ['home', 'Home'], ['about', 'About'], ['projects', 'Projects'], ['learning', 'Learning'],
  ['certificates', 'Certificates'], ['journey', 'Journey'], ['contact', 'Contact'],
];

const STACK_TOP = ['HTML5', 'CSS3', 'CSS Flexbox', 'Bootstrap', 'JavaScript', 'React.js', 'Responsive Design', 'Node.js'];
const STACK_BOTTOM = ['Python', 'SQL', 'C', 'Git', 'GitHub', 'VS Code', 'REST APIs', 'Problem Solving'];

const SERVICES = [
  ['Frontend Development', ['Semantic HTML and modern CSS layouts', 'CSS Flexbox and Bootstrap grids', 'Responsive, mobile-first web pages']],
  ['Interactive Apps with JavaScript', ['DOM manipulation and events', 'Fetching data from APIs', 'Dynamic web applications']],
  ['React.js Interfaces', ['Components, props and state', 'Routing and reusable UI', 'Thinking in components']],
  ['Backend with Node.js & SQL', ['Server-side JavaScript with Node.js', 'Relational databases and SQL queries', 'Connecting frontend to backend']],
  ['Programming Foundations', ['Python and C fundamentals', 'Programming logic and problem solving', 'Clean, readable code habits']],
];

const CERTS = [
  { img: 'cert-static', alt: 'Build Your Own Static Website certificate', label: 'View Static Website certificate', a: 'YOUR OWN', em: 'static', b: 'WEBSITE',
    text: 'Build Your Own Static Website — structuring pages with HTML, styling them with CSS and laying them out with Bootstrap. Issued 27 May 2025 by NxtWave.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7452620065113264129/' },
  { img: 'cert-python', alt: 'Programming Foundations with Python certificate', label: 'View Python certificate', a: 'PYTHON', em: 'programming', b: 'FOUNDATIONS',
    text: 'Programming Foundations with Python — variables, conditions, loops, functions and the problem-solving habits behind every program. Issued 2 June 2025 by NxtWave.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7452618755001716736/' },
  { img: 'cert-dynamic', alt: 'Build Your Own Dynamic Web Application certificate', label: 'View Dynamic Web Application certificate', a: 'YOUR OWN', em: 'dynamic', b: 'WEB APP',
    text: 'Build Your Own Dynamic Web Application — bringing pages to life with JavaScript, events, the DOM and data from APIs. Issued 27 September 2025 by NxtWave.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7452619777413595136/' },
  { img: 'cert-responsive', alt: 'Build Your Own Responsive Website certificate', label: 'View Responsive Website certificate', a: 'YOUR OWN', em: 'responsive', b: 'WEBSITE',
    text: 'Build Your Own Responsive Website — layouts that adapt from phones to wide screens with Flexbox, media queries and a mobile-first approach. Issued 2 December 2025 by NxtWave.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7452619280371818496/' },
  { img: 'cert-flexbox', alt: 'Responsive Web Design using Flexbox certificate', label: 'View Responsive Web Design using Flexbox certificate', a: 'RESPONSIVE', em: 'with', b: 'FLEXBOX',
    text: 'Responsive Web Design using Flexbox — aligning, distributing and reordering content with Flexbox so layouts flow naturally on every screen. Issued 4 January 2026 by NxtWave.',
    url: 'https://certificates.ccbp.in/academy/responsive-web-design-using-flexbox?id=NTKXWLUOLU', linkText: 'Verify' },
];

const JOURNEY = [
  { tag: 'Jul 2024', mono: 'fellow · ccbp 4.0', big: 'NxtWave', title: 'NxtWave', sub: 'Fellow · CCBP 4.0 Academy', date: 'Jul 2024 — Dec 2028' },
  { tag: '2024', mono: 'engineering', big: 'Vaagdevi', title: 'Vaagdevi College of Engineering', sub: 'Engineering studies', date: '2024 — 2028' },
  { tag: 'May 2025', mono: 'html · css · bootstrap', big: 'Static', title: 'Static Website', sub: 'First certificate', date: '27 May 2025' },
  { tag: 'Jun 2025', mono: 'python', big: 'Python', title: 'Programming Foundations', sub: 'Python logic', date: '2 Jun 2025' },
  { tag: 'Sep 2025', mono: 'javascript · dom', big: 'Dynamic', title: 'Dynamic Web Application', sub: 'Interactive JavaScript', date: '27 Sep 2025' },
  { tag: 'Dec 2025', mono: 'flexbox · media queries', big: 'Responsive', title: 'Responsive Website', sub: 'Mobile-first layouts', date: '2 Dec 2025' },
  { tag: 'Jan 2026', mono: 'flexbox · layouts', big: 'Flexbox', title: 'Responsive Web Design using Flexbox', sub: 'Flexible layouts', date: '4 Jan 2026' },
  { tag: 'Next', mono: 'react · node · sql', big: 'Full stack', title: "What's next", sub: 'Complete full stack web apps', date: 'In progress', next: true },
];

// Swap these src values for a CDN URL (e.g. Cloudinary) without touching the markup.
const EHUB_VIDEOS = [
  { id: 'trailer', label: 'Product trailer', len: '3:47', src: '/video/ehub-trailer-1080.mp4', poster: 'ehub-trailer' },
  { id: 'story', label: 'Animated story', len: '1:15', src: '/video/ehub-story-1080.mp4', poster: 'ehub-story' },
];

const EHUB_FLOW = [
  ['Discover', 'Events in every student’s feed'],
  ['Register & pay', 'Razorpay, or UPI with proof'],
  ['Teams', 'One invite code, roster confirmed'],
  ['Check-in', 'Signed QR pass scanned at the gate'],
  ['Judging', 'Private link, clear rubric'],
  ['Certify', 'Issued only to verified attendees'],
];

const EHUB_FEATURES = [
  ['01', 'Payments with receipts', 'Razorpay for card, UPI and netbanking — or UPI with uploaded proof, reviewed in one organizer queue.'],
  ['02', 'Signed QR passes', 'Camera-first gate check-in on any phone. No proxies, no new hardware.'],
  ['03', 'Live attendance', 'Who’s in, who’s absent — filtered by team, synced across every device.'],
  ['04', 'Fair, private judging', 'Each judge gets a private link and a rubric; scores tracked per team.'],
  ['05', 'Verifiable certificates', 'Designed in minutes, issued to attendees only, checkable by anyone via link or QR.'],
  ['06', 'Roles & waitlists', 'Admins, coordinators, judges and volunteers each in their lane; smart waitlist promotion.'],
];

const EHUB_STACK = ['React 19', 'TypeScript', 'Vite', 'React Router 7', 'TanStack Query', 'React-Bootstrap', 'SCSS', 'Razorpay'];

const GitHubIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>;
const Arrow = () => <svg className="service-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 9v8H9" /></svg>;
const MailIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
const External = ({ href, className, children, ...rest }) => (
  <a className={className} href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>
);

export default function Page() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <div className="preloader" aria-hidden="true">
        <div className="preloader-glow" />
        <p className="preloader-greet"><span>Hello</span></p>
        <div className="intro-stage" />
      </div>

      <header className="site-header">
        <a className="wordmark" href="#home"><span className="wordmark-full">SHIVASAI AILLABOINA</span><span className="wordmark-short">SHIVASAI</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {NAV.map(([id, label]) => <a key={id} href={`#${id}`} data-nav={id}>{label}</a>)}
        </nav>
        <button className="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span /><span /></button>
        <span className="scroll-progress" aria-hidden="true" />
      </header>

      <div className="mobile-menu" id="mobile-menu" hidden>
        <nav aria-label="Mobile navigation">
          {NAV.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
      </div>

      <main id="main">
        {/* HERO */}
        <section className="hero" id="home" aria-labelledby="hero-title">
          <canvas className="hero-stars" aria-hidden="true" />
          <canvas className="hero-portrait" aria-hidden="true" />
          <img className="portrait-source" id="portrait-source" src="/images/portrait.webp" alt="Portrait of Shivasai Aillaboina" width="1000" height="1000" fetchPriority="high" decoding="async" />
          <div className="hero-content">
            <h1 id="hero-title" className="hero-title metal">PORTFOLIO</h1>
            <div className="hero-bottom">
              <p className="hero-role"><strong>Full Stack</strong> <em>Developer</em></p>
              <div className="hero-actions">
                <a className="round-btn" href="#about" aria-label="Scroll to about section"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 7 7 17M7 9v8h8" /></svg></a>
                <a className="ghost-pill" href="#contact">Contact</a>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about" id="about" aria-labelledby="about-title">
          <div className="about-grid container">
            <div className="about-head">
              <span className="eyebrow">About me</span>
              <h2 id="about-title" className="intro-word metal" data-fade="">Intro</h2>
            </div>
            <div className="about-card" data-fade="">
              <p className="word-reveal">Hey, I&apos;m <b>Shivasai.</b> An aspiring <b>full stack developer</b> from Warangal, Telangana, learning to build scalable web applications end to end. I&apos;m working through the <b>NxtWave CCBP 4.0 Academy</b> while studying at <b>Vaagdevi College of Engineering</b> — from responsive layouts in <b>HTML, CSS and Bootstrap</b> to interactive apps in <b>JavaScript</b> and <b>React.js</b>, with <b>Node.js, Python and SQL</b> powering what happens behind the screen.</p>
            </div>
          </div>
          <div className="stack container-wide">
            <div className="stack-label"><span className="eyebrow">The stack</span><span className="rule" /></div>
            <div className="marquee" data-direction="left"><ul className="marquee-track">{STACK_TOP.map((s) => <li key={s}>{s}</li>)}</ul></div>
            <div className="marquee" data-direction="right"><ul className="marquee-track">{STACK_BOTTOM.map((s) => <li key={s}>{s}</li>)}</ul></div>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="work" id="projects" aria-labelledby="projects-title">
          <div className="container work-head">
            <span className="eyebrow">Selected work</span>
            <h2 id="projects-title" className="lines-heading lines-left lines-wide" data-lines=""><span><span className="metal">MY</span></span><span><span className="metal">PROJECTS</span></span></h2>
          </div>

        <article className="ehub" id="ehub" aria-labelledby="ehub-title">
          <div className="container ehub-head">
            <span className="project-num">01 — Flagship project</span>
            <h3 id="ehub-title" className="lines-heading ehub-title" data-lines=""><span><span className="metal">eHub</span></span></h3>
            <p className="ehub-tagline" data-fade="">Every campus event. <em>One verified record.</em></p>
            <p className="ehub-lede" data-fade="">A web platform that runs the full life cycle of a college event — discovery, registration, teams, payments, signed QR passes, gate check-in, judging, and certificates issued only to students who actually attended, which anyone can verify online.</p>
            <dl className="ehub-meta" data-fade="">
              <div><dt>Type</dt><dd>Web platform · works on any phone</dd></div>
              <div><dt>Status</dt><dd><i className="live-dot" />Live since October 2026</dd></div>
              <div><dt>Built for</dt><dd>Seva First Innovation Challenge 2026</dd></div>
              <div><dt>Users</dt><dd>Students, organizers, judges, admins</dd></div>
            </dl>
          </div>

          <div className="ehub-stage-wrap container">
            <div className="ehub-stage" data-fade="">
              <div className="ehub-screen">
                <video className="ehub-loop" muted playsInline loop preload="none" poster="/images/ehub-trailer-960.webp" aria-hidden="true" tabIndex={-1} data-src="/video/ehub-loop-720.mp4" />
                <video className="ehub-player" playsInline preload="none" poster="/images/ehub-trailer-1920.webp" aria-label="eHub product video" hidden />
                <button className="ehub-play" type="button" aria-label="Play the selected eHub video with sound">
                  <span className="ehub-play-ring" aria-hidden="true" />
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
                </button>
                <span className="ehub-screen-label mono" aria-hidden="true"><i />Watch · <b className="ehub-now">Product trailer 3:47</b></span>
              </div>
            </div>
            <div className="ehub-tabs" role="group" aria-label="Choose an eHub video">
              {EHUB_VIDEOS.map((v, i) => (
                <button key={v.id} type="button" className="ehub-tab" data-video={i} aria-pressed={i === 0 ? 'true' : 'false'} data-src={v.src} data-poster={`/images/${v.poster}-1920.webp`} data-label={`${v.label} ${v.len}`}>
                  <img src={`/images/${v.poster}-960.webp`} alt="" width="960" height="540" loading="lazy" decoding="async" />
                  <span><b>{v.label}</b><span className="mono">{v.len}</span></span>
                </button>
              ))}
            </div>
          </div>

          <div className="container ehub-ps">
            <div className="ehub-problem" data-fade="">
              <span className="eyebrow">The problem</span>
              <h4>Campus events still run on chaos.</h4>
              <p>Most colleges organise hackathons, workshops and fests through scattered tools — so students miss opportunities, payments leave no trail, and certificates can&apos;t be trusted.</p>
              <ul>
                <li><s>WhatsApp forwards</s><span>Missed opportunities</span></li>
                <li><s>Paper registers</s><span>Lost records</span></li>
                <li><s>Cash payments</s><span>No receipts</span></li>
                <li><s>Hand-typed certificates</s><span>Can&apos;t be verified</span></li>
              </ul>
            </div>
            <div className="ehub-solution" data-fade="">
              <span className="eyebrow">The solution</span>
              <h4>One platform, from announcement to certificate.</h4>
              <p>eHub gives every role its own lane. Students discover, register, pay and walk in with a signed pass. Organizers publish events, track registrations, review payments and check people in at the gate. Judges score privately against a rubric, and certificates go only to verified attendees — each with a unique ID anyone can check, no login needed.</p>
              <p>It runs on low-cost cloud infrastructure and on the phones people already carry, so any college can adopt it without new hardware.</p>
            </div>
          </div>

          <div className="container ehub-flow-wrap">
            <div className="stack-label"><span className="eyebrow">One platform, start to finish</span><span className="rule" /></div>
            <ol className="ehub-flow" data-fade="">
              {EHUB_FLOW.map(([t, d], i) => (
                <li key={t} style={{ '--i': i }}><span className="ehub-node" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><b>{t}</b><span>{d}</span></li>
              ))}
            </ol>
          </div>

          <div className="container ehub-features">
            {EHUB_FEATURES.map(([n, t, d], i) => (
              <article className="ehub-card" data-fade="" style={{ '--i': i % 3 }} key={t}>
                <span className="mono">{n}</span><h3>{t}</h3><p>{d}</p>
              </article>
            ))}
          </div>

          <div className="container ehub-foot">
            <ul className="ehub-facts" data-fade="">
              <li><b>Live</b><span>since October 2026</span></li>
              <li><b>Any phone</b><span>no new hardware</span></li>
              <li><b>Low-cost</b><span>cloud any college can sustain</span></li>
            </ul>
            <div className="ehub-stack" data-fade="">
              <span className="eyebrow">Built with</span>
              <ul>{EHUB_STACK.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
            <div className="btn-row" data-fade="">
              <External className="solid-pill" href={EHUB_LIVE}>Open live app <span aria-hidden="true">↗</span></External>
              <External className="outline-pill" href={GITHUB}><GitHubIcon /> GitHub</External>
            </div>
          </div>
        </article>
        </section>

        {/* LEARNING */}
        <section className="learning" id="learning" aria-labelledby="learning-title">
          <div className="learning-head container">
            <h2 id="learning-title" className="lines-heading" data-lines=""><span><span className="metal">WHAT I&apos;M</span></span><span><span className="metal">LEARNING</span></span></h2>
          </div>
          <div className="service-list">
            {SERVICES.map(([name, items], i) => (
              <article className="service-row" key={name}>
                <button className="service-toggle" type="button" aria-expanded="false"><span className="service-num">{String(i + 1).padStart(2, '0')}</span><span className="service-name">{name}</span><Arrow /></button>
                <div className="service-body"><ul>{items.map((it) => <li key={it}>{it}</li>)}</ul></div>
              </article>
            ))}
          </div>
        </section>

        {/* CERTIFICATES */}
        <section className="projects" id="certificates" aria-labelledby="certificates-title">
          <div className="container projects-head">
            <span className="eyebrow">Selected learning</span>
            <h2 id="certificates-title" className="lines-heading lines-left lines-wide" data-lines=""><span><span className="metal">MY</span></span><span><span className="metal">CERTIFICATES</span></span></h2>
          </div>
          {CERTS.map((c, i) => (
            <article className={`project container${i % 2 ? ' reverse' : ''}`} data-fade="" key={c.img}>
              <button className="project-media" type="button" data-cert={i} aria-label={c.label}><img src={`/images/${c.img}-900.webp`} srcSet={`/images/${c.img}-900.webp 900w, /images/${c.img}-1800.webp 1800w`} sizes="(max-width: 860px) 90vw, 45vw" alt={c.alt} width="900" height="636" loading="lazy" decoding="async" /></button>
              <div className="project-text">
                <span className="project-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="project-title">{c.a} <em>{c.em}</em><br />{c.b}</h3>
                <p>{c.text}</p>
                <div className="btn-row"><button className="solid-pill" type="button" data-cert={i}>View certificate <span aria-hidden="true">↗</span></button><External className="outline-pill" href={c.url}>{c.linkText || 'LinkedIn'} <span aria-hidden="true">↗</span></External></div>
              </div>
            </article>
          ))}
        </section>

        {/* JOURNEY */}
        <section className="journey" id="journey" aria-labelledby="journey-title">
          <div className="journey-sticky">
            <div className="journey-inner container">
              <aside className="journey-side">
                <div className="journey-panel">
                  <h2 id="journey-title">Always a student, one step at a time.</h2>
                  <p>Two places of learning and five milestones so far — every one of them a new way to bring an idea to life.</p>
                </div>
                <div className="journey-panel journey-cta">
                  <a className="square-btn solid" href="#certificates">See certificates <span aria-hidden="true">↗</span></a>
                  <a className="square-btn" href="#contact">Message me</a>
                </div>
              </aside>
              <div className="journey-shelf">
                <ol className="journey-track">
                  {JOURNEY.map((j) => (
                    <li className={`journey-card${j.next ? ' next' : ''}`} key={j.title}>
                      <span className="tag">{j.tag}</span>
                      <div className="journey-screen"><span className="mono">{j.mono}</span><strong>{j.big}</strong></div>
                      <div className="journey-meta"><h3>{j.title}</h3><p>{j.sub}</p><span className="mono">{j.date}</span></div>
                    </li>
                  ))}
                </ol>
                <div className="journey-foot"><span className="journey-dots" aria-hidden="true" /><span className="mono accent">↓ Scroll to move the shelf</span><span className="mono journey-count" aria-hidden="true">1 / {JOURNEY.length}</span></div>
              </div>
            </div>
            <div className="journey-progress container" aria-hidden="true"><span className="mono">Scroll = shelf</span><span className="journey-bar"><i /></span><span className="mono journey-p">P 0.00</span></div>
          </div>
        </section>

        {/* PLAY */}
        <section className="play" id="play" aria-labelledby="play-title">
          <div className="container play-inner">
            <h2 id="play-title" className="play-caption">Break it if you can. It still ships.</h2>
            <canvas className="breakout" role="img" aria-label="Breakout game spelling HELLO WORLD. Press Play, then move the mouse or your finger, or use the arrow keys, to control the paddle." />
            <button className="play-btn" type="button">PLAY</button>
            <p className="play-status mono" aria-live="polite" />
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact" id="contact" aria-labelledby="contact-title">
          <canvas className="smoke" aria-hidden="true" />
          <div className="contact-grid container">
            <div className="contact-left" data-fade="">
              <span className="status-pill"><i />Let&apos;s connect</span>
              <h2 id="contact-title" className="metal contact-title">Get in touch</h2>
              <p>Ideas, opportunities, internships or just a hello — I&apos;d love to hear from you. Email gets the fastest reply.</p>
              <div className="btn-row"><a className="solid-pill" href={`mailto:${EMAIL}`}>Send an email <MailIcon /></a><External className="outline-pill" href={LINKEDIN}>LinkedIn <span aria-hidden="true">↗</span></External></div>
            </div>
            <dl className="contact-card" data-fade="">
              <div><dt>Email</dt><dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
              <div><dt>Based in</dt><dd>Warangal Urban, Telangana, India</dd></div>
              <div><dt>Learning at</dt><dd>NxtWave CCBP 4.0 · Vaagdevi College of Engineering</dd></div>
              <div><dt>Elsewhere</dt><dd className="socials">
                <External className="icon-btn" href={LINKEDIN} aria-label="LinkedIn profile"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9v9M6 6v.01M10 18v-5a3 3 0 0 1 6 0v5M10 9v9" /></svg></External>
                <External className="icon-btn" href={GITHUB} aria-label="GitHub profile"><GitHubIcon /></External>
                <a className="icon-btn" href={`mailto:${EMAIL}`} aria-label="Email"><MailIcon /></a>
              </dd></div>
            </dl>
          </div>
          <footer className="site-footer container">
            <p>© <span id="year">2026</span> Shivasai Aillaboina. All rights reserved.</p>
            <nav aria-label="Footer">{NAV.slice(0, 4).map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
          </footer>
        </section>
      </main>

      <dialog className="cert-dialog" id="cert-dialog" aria-labelledby="cert-dialog-title">
        <div className="cert-dialog-head"><h2 id="cert-dialog-title">Certificate</h2><button className="icon-btn dialog-close" type="button" aria-label="Close certificate">×</button></div>
        <img id="cert-dialog-img" src="/images/cert-static-1800.webp" alt="" width="1800" height="1273" loading="lazy" decoding="async" />
        <External className="outline-pill" href={CERTS[0].url} id="cert-dialog-link">View original LinkedIn post <span aria-hidden="true">↗</span></External>
      </dialog>

      <PortfolioEffects />
    </>
  );
}
