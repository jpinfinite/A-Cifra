/**
 *a gerar imagem exemplo via API Cloudflare
 *
 * Uso: node scripts/gerar-imagem-exemplo.js
 *
 * Nota: Execute este script com o navegador aberto em a-cifra.com.br
 * ou use a interface web em /admin/image-generator
 */

const prompt = `
Professional Bitcoin price analysis cover image.

Background: Dark blue gradient from #041924 to #00283B with subtle grid pattern.

Main element: Large golden Bitcoin symbol (₿) in center with glowing effect.

Chart: Upward trending candlestick chart with green candles showing bullish momentum.

Data: Price indicator "$95,000" with upward arrow and "+15%" in green.

Style: Modern financial data visualization, clean minimalist design, professional aesthetic.

Technical: 1200x630 pixels, high quality, space for title overlay, no text, no watermark.
`.trim();

console.log('🎨 Gerador de Imagem A Cifra\n');
console.log('📋 Prompt preparado:');
console.log('─'.repeat(60));
console.log(prompt);
console.log('─'.repeat(60));
console.log('\n💡 Como usar:\n');
console.log('Opção 1: Interface Web (Recomendado)');
console.log('  1. Acesse: https://a-cifra.com.br/admin/image-generator');
console.log('  2. Cole o prompt acima');
console.log('  3. Estilo: Professional');
console.log('  4. Slug: bitcoin-95k-analise-completa');
console.log('  5. Clique "Gerar Imagem com IA"');
console.log('  6. Aguarde 10-30 segundos');
console.log('  7. Baixe a imagem\n');

console.log('Opção 2: Console do Navegador');
console.log('  1. Abra: https://a-cifra.com.br');
console.log('  2. Pressione F12 (Console)');
console.log('  3. Cole o código abaixo:\n');

const fetchCode = `
fetch('https://a-cifra.com.br/api/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: \`${prompt}\`,
    style: 'professional',
    articleSlug: 'bitcoin-95k-analise-completa'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Imagem gerada!');
  const img = document.createElement('img');
  img.src = data.image;
  img.style.maxWidth = '100%';
  img.style.border = '2px solid #E1A441';
  img.style.borderRadius = '8px';
  img.style.margin = '20px';
  document.body.insertBefore(img, document.body.firstChild);

  const btn = document.createElement('a');
  btn.href = data.image;
  btn.download = 'bitcoin-95k-analise.png';
  btn.textContent = '📥 Baixar Imagem';
  btn.style.cssText = 'position:fixed;top:20px;right:20px;background:#E1A441;color:#041924;padding:15px 30px;border-radius:8px;font-weight:bold;text-decoration:none;z-index:9999;box-shadow:0 4px 6px rgba(0,0,0,0.3);';
  document.body.appendChild(btn);
})
.catch(err => console.error('❌ Erro:', err));
`;

console.log(fetchCode);
console.log('\n🎯 Resultado esperado:');
console.log('  - Fundo: Gradiente azul escuro');
console.log('  - Centro: Bitcoin ₿ dourado brilhante');
console.log('  - Gráfico: Candlesticks verdes ascendentes');
console.log('  - Estilo: Profissional, limpo, tech');
console.log('  - Dimensões: 1200x630px\n');

console.log('📁 Salvar em: /public/images/articles/bitcoin-95k-analise-completa.webp');
console.log('🎨 Pronto para usar no artigo!\n');

