# 🎨 Testar Geração de Imagem - A Cifra

## 🚀 Método 1: Console do Navegador (Mais Rápido)

### Passo a Passo

1. **Abra o site:**
   ```
   https://a-cifra.com.br
   ```

2. **Abra o Console do Navegador:**
   - Windows/Linux: `F12` ou `Ctrl + Shift + J`
   - Mac: `Cmd + Option + J`

3. **Cole este código:**

```javascript
fetch('https://a-cifra.com.br/api/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Professional Bitcoin price analysis cover image. Dark blue gradient background from #041924 to #00283B. Large golden Bitcoin symbol in center with gg effect. Upward trending candlestick chart with green candles. Modern financial data visualization. Clean minimalist design.',
    style: 'professional',
    articleSlug: 'bitcoin-95k-analise-completa'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Imagem gerada!');
  console.log('Prompt usado:', data.prompt);

  // Criar elemento de imagem
  const img = document.createElement('img');
  img.src = data.image;
  img.style.maxWidth = '100%';
  img.style.border = '2px solid #E1A441';
  img.style.borderRadius = '8px';
  img.style.margin = '20px';

  // Adicionar ao body
  document.body.insertBefore(img, document.body.firstChild);

  // Criar botão de download
  const btn = document.createElement('a');
  btn.href = data.image;
  btn.download = 'bitcoin-95k-analise-completa.png';
  btn.textContent = '📥 Baixar Imagem';
  btn.style.cssText = 'position:fixed;top:20px;right:20px;background:#E1A441;color:#041924;padding:15px 30px;border-radius:8px;font-weight:bold;text-decoration:none;z-index:9999;box-shadow:0 4px 6px rgba(0,0,0,0.3);';
  document.body.appendChild(btn);

  console.log('🎨 Imagem exibida no topo da página!');
  console.log('📥 Clique no botão dourado para baixar');
})
.catch(err => {
  console.error('❌ Erro:', err);
});
```

4. **Pressione Enter**

5. **Aguarde 10-30 segundos**

6. **A imagem aparecerá no topo da página!**

7. **Clique no botão dourado para baixar**

---

## 🎯 Método 2: Interface do Site

1. **Acesse:**
   ```
   https://a-cifra.com.br/admin/image-generator
   ```

2. **Cole o prompt:**
   ```
   Professional Bitcoin price analysis cover image.
   Dark blue gradient background from #041924 to #00283B.
   Large golden Bitcoin symbol in center with glowing effect.
   Upward trending candlestick chart with green candles.
   Modern financial data visualization.
   Clean minimalist design.
   ```

3. **Configurações:**
   - Estilo: **Professional**
   - Slug: `bitcoin-95k-analise-completa`

4. **Clique:** "Gerar Imagem com IA"

5. **Aguarde e baixe!**

---

## 🧪 Método 3: Postman/Insomnia (Para Desenvolvedores)

### Configuração

**URL:**
```
POST https://a-cifra.com.br/api/generate-image
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (JSON):**
```json
{
  "prompt": "Professional Bitcoin price analysis cover image. Dark blue gradient background from #041924 to #00283B. Large golden Bitcoin symbol in center with glowing effect. Upward trending candlestick chart with green candles showing bullish momentum. Modern financial data visualization. Clean minimalist design. High quality, sharp details.",
  "style": "professional",
  "articleSlug": "bitcoin-95k-analise-completa"
}
```

**Response esperado:**
```json
{
  "success": true,
  "prompt": "Professional Bitcoin price analysis...",
  "image": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "imageUrl": "https://media.a-cifra.com.br/articles/bitcoin-95k-analise-1733270400000.png"
}
```

---

## 🎨 Variações de Prompt para Testar

### Variação 1: Mais Detalhada
```javascript
{
  "prompt": "Professional cryptocurrency cover image for Bitcoin price analysis article. Dark blue gradient background transitioning from #041924 at top to #00283B at bottom, with subtle hexagonal grid pattern overlay. Large golden Bitcoin symbol (₿) prominently displayed in center with soft glowing aura effect in #E1A441. Behind the symbol, an upward trending candlestick chart with bright green candles (#10B981) showing strong bullish momentum. Modern financial data visualization aesthetic with clean lines. Price indicator showing $95,000 in bright blue (#155C8B). Professional trading interface style. Minimalist, clean, high quality, sharp focus, 1200x630 pixels.",
  "style": "professional",
  "articleSlug": "bitcoin-95k-analise-detalhada"
}
```

### Variação 2: Minimalista
```javascript
{
  "prompt": "Minimalist Bitcoin analysis cover. Dark blue background. Single large golden Bitcoin symbol. Simple upward arrow. Clean modern design.",
  "style": "minimalist",
  "articleSlug": "bitcoin-95k-analise-minimal"
}
```

### Variação 3: Vibrante
```javascript
{
  "prompt": "Dynamic Bitcoin price surge visualization. Vibrant blue and gold colors. Energetic upward movement. Bold golden Bitcoin symbol. Exciting bullish momentum.",
  "style": "vibrant",
  "articleSlug": "bitcoin-95k-analise-vibrant"
}
```

---

## 📊 O Que Analisar no Resultado

### ✅ Checklist Visual

**Cores:**
- [ ] Fundo azul escuro (#041924 - #00283B)?
- [ ] Bitcoin dourado (#E1A441)?
- [ ] Gráfico verde (#10B981)?
- [ ] Acentos azuis (#155C8B)?

**Elementos:**
- [ ] Bitcoin symbol (₿) visível e central?
- [ ] Gráfico de candlesticks presente?
- [ ] Tendência de alta clara?
- [ ] Espaço para título no topo?

**Qualidade:**
- [ ] Imagem nítida e clara?
- [ ] Sem distorções?
- [ ] Dimensões corretas (1200x630)?
- [ ] Profissional e limpa?

**Identidade:**
- [ ] Parece A Cifra?
- [ ] Consistente com marca?
- [ ] Transmite confiança?
- [ ] Adequada para artigo de análise?

---

## 💡 Troubleshooting

### Erro: "Prompt is required"
**Solução:** Verifique se o prompt não está vazio

### Erro: CORS
**Solução:** Execute do próprio site (a-cifra.com.br)

### Erro: Timeout
**Solução:** Aguarde mais tempo (até 60s) ou tente novamente

### Imagem não aparece
**Solução:** Verifique console do navegador para erros

### Qualidade ruim
**Solução:** Use prompt mais detalhado e específico

---

## 🎯 Próximos Passos Após Gerar

1. **Analisar a imagem:**
   - Cores corretas?
   - Elementos visíveis?
   - Qualidade boa?

2. **Se aprovada:**
   - Baixar em alta resolução
   - Salvar em `/public/images/articles/`
   - Adicionar ao frontmatter do artigo

3. **Se precisa ajustes:**
   - Refinar o prompt
   - Testar outro estilo
   - Gerar nova versão

4. **Otimizar:**
   ```bash
   node scripts/convert-to-webp.js
   ```

5. **Usar no artigo:**
   ```yaml
   coverImage:
     src: '/images/articles/bitcoin-95k-analise-completa.webp'
     alt: 'Bitcoin atingindo $95k - Análise completa'
   ```

---

## 🚀 Teste AGORA!

**Recomendação:** Use o **Método 1** (Console do Navegador)

É o mais rápido e você verá o resultado imediatamente na página!

**Tempo total:** ~30 segundos

---

**Boa sorte! Me mostre o resultado quando gerar! 🎨**

