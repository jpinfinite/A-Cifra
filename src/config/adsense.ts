/**
 * Configuração do Google AdSense
 * 
 * IMPORTANTE: Após criar as unidades de anúncio no Google AdSense,
 * substitua os valores abaixo pelos seus Ad Slot IDs reais.
 */

export const adSenseConfig = {
  // Seu Publisher ID (já configurado no layout.tsx)
  publisherId: 'ca-pub-1151448515464841',
  
  // Ad Slot IDs - Substitua pelos seus IDs reais após criar as unidades
  slots: {
    // Anúncio Display - Para sidebar, topo, entre seções
    display: process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT || '0000000000',
    
    // Anúncio In-Article - Para dentro dos artigos
    inArticle: process.env.NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT || '1111111111',
    
    // Anúncio Multiplex - Para conteúdo relacionado
    multiplex: process.env.NEXT_PUBLIC_ADSENSE_MULTIPLEX_SLOT || '2222222222',
    
    // Anúncio Display Sidebar - Específico para sidebar
    displaySidebar: process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_SIDEBAR_SLOT || '3333333333',
    
    // Anúncio Display Header - Para topo da página
    displayHeader: process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_HEADER_SLOT || '4444444444',
  },
  
  // Configurações gerais
  enabled: process.env.NODE_ENV === 'production', // Só ativa em produção
  testMode: process.env.NEXT_PUBLIC_ADSENSE_TEST_MODE === 'true',
}

/**
 * Verifica se o AdSense está habilitado
 */
export function isAdSenseEnabled(): boolean {
  return adSenseConfig.enabled && !adSenseConfig.testMode
}

/**
 * Retorna o Ad Slot ID baseado no tipo
 */
export function getAdSlot(type: keyof typeof adSenseConfig.slots): string {
  return adSenseConfig.slots[type]
}
