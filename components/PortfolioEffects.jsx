'use client';

import { useEffect } from 'react';

// Loads the animation layer after hydration, in its own chunk.
export default function PortfolioEffects() {
  useEffect(() => {
    import('../lib/portfolio.js').then(({ initPortfolio }) => initPortfolio());
  }, []);
  return null;
}
