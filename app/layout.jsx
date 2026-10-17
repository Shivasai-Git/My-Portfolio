import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { PORTRAIT_SRCSET, PORTRAIT_SIZES } from '../lib/portrait';

// Inter and JetBrains Mono are variable fonts: one file covers every weight.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap', preload: false });

export const metadata = {
  title: 'Shivasai Aillaboina | Portfolio',
  description: 'Shivasai Aillaboina, aspiring full stack developer working with React.js, Node.js, and Python.',
  openGraph: {
    title: 'Shivasai Aillaboina | Portfolio',
    description: 'Aspiring full stack developer. React.js, Node.js, Python.',
    type: 'website',
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23050505'/%3E%3Ctext x='32' y='45' font-family='Arial' font-weight='900' font-size='38' text-anchor='middle' fill='%23fff'%3ES%3C/text%3E%3C/svg%3E",
  },
};

export const viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Set before first paint so scroll-reveal styles apply without a flash. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preload" as="image" type="image/webp" imageSrcSet={PORTRAIT_SRCSET} imageSizes={PORTRAIT_SIZES} />
      </head>
      <body className="is-loading" suppressHydrationWarning>{children}</body>
    </html>
  );
}
