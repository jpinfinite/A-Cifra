



'use client'

import { useEffect } from 'react'

export function AdSenseLoader() {
  useEffect(() => {
    // Flag to prevent multiple loads
    let loaded = false;

    const loadAds = () => {
      if (loaded || window.adsbygoogle) return;
      loaded = true;

      const s = document.createElement('script');
      s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1151448515464841';
      s.async = true;
      s.crossOrigin = 'anonymous';
      document.body.appendChild(s);
    };

    const onFirstInteraction = () => {
      loadAds();
      // Remove listeners after first interaction
      window.removeEventListener('scroll', onFirstInteraction);
      window.removeEventListener('mousemove', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };

    // Add listeners for various interactions
    window.addEventListener('scroll', onFirstInteraction, { once: true, passive: true });
    window.addEventListener('mousemove', onFirstInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });
    window.addEventListener('keydown', onFirstInteraction, { once: true, passive: true });

    // Fallback: load after 5 seconds if no interaction
    const timeout = setTimeout(loadAds, 5000);

    return () => {
      window.removeEventListener('scroll', onFirstInteraction);
      window.removeEventListener('mousemove', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
