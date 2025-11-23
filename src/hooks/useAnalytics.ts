'use client';

import { useEffect } from 'react';
import {
  trackArticleView,
  setupScrollTracking,
  setupTimeTracking,
} from '@/utils/analytics';

/**
 * Hook para rastrear visualização de artigo automaticamente
 */
export const useArticleTracking = (
  articleTitle: string,
  articleSlug: string,
  category?: string
) => {
  useEffect(() => {
    // Rastreia visualização do artigo
    trackArticleView(articleTitle, articleSlug, category);

    // Configura rastreamento de scroll
    setupScrollTracking(articleSlug);

    // Configura rastreamento de tempo
    setupTimeTracking(articleSlug);

    // Cleanup não é necessário pois as funções já gerenciam isso internamente
  }, [articleTitle, articleSlug, category]);
};

/**
 * Hook para rastrear página view
 */
export const usePageView = (pageName: string) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }
  }, [pageName]);
};
