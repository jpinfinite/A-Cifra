// Google Analytics 4 - Utility Functions

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

// Tipos de eventos
export type EventName =
  | 'page_view'
  | 'article_view'
  | 'newsletter_subscribe'
  | 'external_link_click'
  | 'share_article'
  | 'search'
  | 'ad_click';

interface EventParams {
  [key: string]: string | number | boolean;
}

/**
 * Envia evento para Google Analytics
 */
export const trackEvent = (
  eventName: EventName,
  params?: EventParams
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Rastreia visualização de artigo
 */
export const trackArticleView = (
  articleTitle: string,
  articleSlug: string,
  category?: string
): void => {
  trackEvent('article_view', {
    article_title: articleTitle,
    article_slug: articleSlug,
    article_category: category || 'uncategorized',
  });
};

/**
 * Rastreia inscrição na newsletter
 */
export const trackNewsletterSubscribe = (email: string): void => {
  trackEvent('newsletter_subscribe', {
    method: 'website_form',
    email_domain: email.split('@')[1] || 'unknown',
  });
};

/**
 * Rastreia clique em link externo
 */
export const trackExternalLink = (url: string, linkText?: string): void => {
  trackEvent('external_link_click', {
    link_url: url,
    link_text: linkText || 'unknown',
    link_domain: new URL(url).hostname,
  });
};

/**
 * Rastreia compartilhamento de artigo
 */
export const trackShare = (
  platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'telegram',
  articleTitle: string
): void => {
  trackEvent('share_article', {
    platform,
    article_title: articleTitle,
  });
};

/**
 * Rastreia busca no site
 */
export const trackSearch = (searchTerm: string, resultsCount: number): void => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

/**
 * Rastreia clique em anúncio
 */
export const trackAdClick = (adPosition: string, adType: string): void => {
  trackEvent('ad_click', {
    ad_position: adPosition,
    ad_type: adType,
  });
};

/**
 * Rastreia tempo de leitura
 */
export const trackReadingTime = (
  articleSlug: string,
  timeInSeconds: number
): void => {
  trackEvent('article_view', {
    article_slug: articleSlug,
    reading_time: timeInSeconds,
    engagement_level:
      timeInSeconds < 30
        ? 'low'
        : timeInSeconds < 120
        ? 'medium'
        : 'high',
  });
};

/**
 * Rastreia scroll depth (profundidade de rolagem)
 */
export const trackScrollDepth = (
  percentage: 25 | 50 | 75 | 100,
  articleSlug: string
): void => {
  trackEvent('article_view', {
    article_slug: articleSlug,
    scroll_depth: percentage,
  });
};

/**
 * Configura rastreamento automático de scroll
 */
export const setupScrollTracking = (articleSlug: string): void => {
  if (typeof window === 'undefined') return;

  const scrollDepths = [25, 50, 75, 100];
  const tracked = new Set<number>();

  const handleScroll = () => {
    const scrollPercentage =
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100;

    scrollDepths.forEach((depth) => {
      if (scrollPercentage >= depth && !tracked.has(depth)) {
        tracked.add(depth);
        trackScrollDepth(depth as 25 | 50 | 75 | 100, articleSlug);
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
};

/**
 * Rastreia tempo na página
 */
export const setupTimeTracking = (articleSlug: string): void => {
  if (typeof window === 'undefined') return;

  const startTime = Date.now();

  const trackTime = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    trackReadingTime(articleSlug, timeSpent);
  };

  // Rastreia quando usuário sai da página
  window.addEventListener('beforeunload', trackTime);

  // Rastreia a cada 30 segundos
  setInterval(trackTime, 30000);
};
