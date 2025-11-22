# 🖼️ Guia de Compressão de Imagens

## 📋 Visão Geral

Este guia mostra como comprimir imagens do site para melhorar a performance no PageSpeed Insights.

**Economia esperada:** ~223 KiB (redução de 40-60%)

---

## 🎯 Opção 1: Automática (Recomendado)

### Passo 1: Obter API Key do TinyPNG

1. Acesse: https://tinypng.com/developers
2. Insira seu nome e email
3. Clique em "Get your API key"
4. Copie a chave que receber por email

**Plano Gratuito:**
- ✅ 500 imagens/mês
- ✅ Sem custo
- ✅ Suficiente para este projeto

### Passo 2: Configurar API Key

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# .env.local
TINIFY_API_KEY=sua_chave_aqui_sem_aspas
```

**Importante:** Este arquivo já está no `.gitignore` e não será commitado.

### Passo 3: Executar Script

```bash
# Executar compressão
node scripts/compress-images.js
```

**O que o script faz:**
1. ✅ Cria backup das imagens originais em `public/images-backup/`
2. ✅ Comprime todas as imagens PNG, JPG e JPEG
3. ✅ Substitui as originais pelas comprimidas
4. ✅ Mostra estatísticas de economia

**Exemplo de saída:**
```
🚀 Iniciando compressão de imagens...

📊 Encontradas 15 imagens para comprimir

📦 Comprimindo: logo.png (245.3 KB)
✅ logo.png: 245.3 KB → 98.7 KB (59.8% menor)

📦 Comprimindo: hero-bg.jpg (512.8 KB)
✅ hero-bg.jpg: 512.8 KB → 187.4 KB (63.5% menor)

...

============================================================
📊 ESTATÍSTICAS FINAIS
============================================================
Total de imagens: 15
✅ Comprimidas: 15
❌ Falhas: 0
💾 Espaço economizado: 1.2 MB
============================================================

✅ Compressão concluída com sucesso!
📁 Backup das originais em: public/images-backup
```

---

## 🎯 Opção 2: Manual (Sem API Key)

### Passo 1: Acessar TinyPNG

Acesse: https://tinypng.com/

### Passo 2: Upload de Imagens

1. Arraste até 20 imagens por vez
2. Aguarde a compressão
3. Clique em "Download all"

### Passo 3: Substituir Imagens

1. Extraia o ZIP baixado
2. Substitua as imagens em `public/images/`
3. Mantenha os mesmos nomes de arquivo

---

## 🎯 Opção 3: Usando Squoosh (Offline)

### Passo 1: Acessar Squoosh

Acesse: https://squoosh.app/

### Passo 2: Configurar Compressão

**Para PNG:**
- Codec: OxiPNG
- Level: 3
- Interlace: Off

**Para JPG:**
- Codec: MozJPEG
- Quality: 85
- Progressive: On

### Passo 3: Processar Imagens

1. Arraste uma imagem
2. Ajuste configurações
3. Clique em "Download"
4. Repita para cada imagem

---

## 📊 Imagens Prioritárias

### Alto Impacto (Comprimir Primeiro)

```
public/images/
├── cifra-principal.png      (Hero image - maior impacto)
├── logos/
│   └── favcoin.png          (Carrega em todas as páginas)
└── categorias/
    ├── bitcoin.png
    ├── ethereum.png
    └── defi.png
```

### Médio Impacto

```
public/images/
├── artigos/
│   └── *.png, *.jpg         (Imagens de artigos)
└── ferramentas/
    └── *.png                (Ícones de ferramentas)
```

---

## ✅ Checklist de Compressão

### Antes de Comprimir
- [ ] Fazer backup manual (copiar pasta `public/images/`)
- [ ] Verificar tamanho atual das imagens
- [ ] Anotar tamanho total da pasta

### Durante Compressão
- [ ] Comprimir imagens prioritárias primeiro
- [ ] Verificar qualidade visual após compressão
- [ ] Manter nomes de arquivo originais

### Após Compressão
- [ ] Verificar se todas as imagens ainda aparecem no site
- [ ] Testar em diferentes dispositivos
- [ ] Fazer commit das imagens comprimidas
- [ ] Testar PageSpeed Insights novamente

---

## 🎨 Conversão para WebP (Opcional)

### Por que WebP?
- ✅ 25-35% menor que PNG
- ✅ 25-34% menor que JPG
- ✅ Suportado por 95%+ dos navegadores

### Como Converter

#### Opção 1: Usando Squoosh
1. Acesse https://squoosh.app/
2. Arraste imagem
3. Escolha "WebP" no lado direito
4. Quality: 85
5. Download

#### Opção 2: Usando cwebp (CLI)
```bash
# Instalar cwebp
# Windows: https://developers.google.com/speed/webp/download
# Mac: brew install webp
# Linux: apt-get install webp

# Converter uma imagem
cwebp -q 85 input.png -o output.webp

# Converter todas as PNG
for file in public/images/*.png; do
  cwebp -q 85 "$file" -o "${file%.png}.webp"
done
```

#### Opção 3: Usando Next.js Image
```tsx
// Next.js converte automaticamente para WebP
import Image from 'next/image'

<Image 
  src="/images/logo.png"  // Pode ser PNG
  alt="Logo"
  width={200}
  height={50}
  // Next.js serve como WebP automaticamente
/>
```

---

## 📈 Resultados Esperados

### Antes da Compressão
```
public/images/: ~2.5 MB
PageSpeed Score: 60-70
```

### Após Compressão
```
public/images/: ~1.0 MB
PageSpeed Score: 75-85
Economia: ~1.5 MB (60%)
```

### Após Conversão WebP
```
public/images/: ~0.7 MB
PageSpeed Score: 85-92
Economia: ~1.8 MB (72%)
```

---

## 🚨 Problemas Comuns

### Erro: "API limit reached"
**Causa:** Limite de 500 imagens/mês atingido  
**Solução:** 
- Usar compressão manual
- Aguardar próximo mês
- Criar nova conta com outro email

### Erro: "Image quality too low"
**Causa:** Compressão muito agressiva  
**Solução:**
- Usar quality 85-90 em vez de 75
- Verificar visualmente antes de substituir

### Erro: "File not found"
**Causa:** Caminho incorreto  
**Solução:**
- Verificar se está na raiz do projeto
- Verificar se pasta `public/images/` existe

---

## 💡 Dicas Importantes

### 1. Sempre Fazer Backup
```bash
# Criar backup manual
cp -r public/images public/images-backup
```

### 2. Testar Visualmente
- Abrir imagens comprimidas
- Verificar se qualidade está boa
- Comparar com originais

### 3. Comprimir Antes de Upload
- Comprimir imagens ANTES de adicionar ao projeto
- Evita commits grandes
- Mantém histórico Git limpo

### 4. Usar next/image
```tsx
// Sempre usar next/image em vez de <img>
import Image from 'next/image'

<Image 
  src="/images/foto.jpg"
  alt="Descrição"
  width={800}
  height={600}
  quality={85}
  loading="lazy"
/>
```

---

## 📞 Próximos Passos

1. **Agora:** Obter API key do TinyPNG
2. **Em 5 min:** Configurar .env.local
3. **Em 10 min:** Executar script de compressão
4. **Em 15 min:** Verificar resultados
5. **Em 20 min:** Commit e push
6. **Em 30 min:** Testar PageSpeed novamente

---

## 🔗 Recursos Úteis

- [TinyPNG](https://tinypng.com/) - Compressão online
- [Squoosh](https://squoosh.app/) - Compressão offline
- [ImageOptim](https://imageoptim.com/) - App para Mac
- [Next.js Image](https://nextjs.org/docs/basic-features/image-optimization) - Documentação

---

**Meta:** Reduzir tamanho das imagens em 60% e melhorar PageSpeed em 10-15 pontos! 🎯

**Última atualização:** 21/11/2024  
**Status:** 📝 Pronto para uso
