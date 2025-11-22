/**
 * Calcula o tempo estimado de leitura de um texto
 * @param text - Texto completo do artigo
 * @param wordsPerMinute - Palavras por minuto (padrão: 200)
 * @returns Tempo de leitura em minutos
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  // Remove HTML tags e caracteres especiais
  const cleanText = text.replace(/<[^>]*>/g, '').replace(/[^\w\s]/g, ' ')
  
  // Conta palavras
  const words = cleanText.trim().split(/\s+/).length
  
  // Calcula tempo em minutos (mínimo 1 minuto)
  const minutes = Math.ceil(words / wordsPerMinute)
  
  return Math.max(1, minutes)
}

/**
 * Formata o tempo de leitura para exibição
 * @param minutes - Tempo em minutos
 * @returns String formatada (ex: "5 min de leitura")
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1 min de leitura'
  }
  return `${minutes} min de leitura`
}
