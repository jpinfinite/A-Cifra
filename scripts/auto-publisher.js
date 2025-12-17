```javascript
const Parser = require('rss-parser');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const slugify = require('unique-slug');
const { execSync } = require('child_process');
const sharp = require('sharp');
const https = require('https');
const dotenv = require('dotenv');

dotenv.config();
dotenv.config({ path: '.env.local' });

// Configurações
const RSS_FEEDS = [
  'https://br.cointelegraph.com/rss',
  'https://www.coindesk.com/arc/outboundfeeds/rss/'
];

// Inicializar APIs
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Necessário apenas para imagens (DALL-E 3)
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

const parser = new Parser();

// Paths
const ARTICLES_DIR = path.join(__dirname, '../content/articles');
const IMAGES_DIR = path.join(__dirname, '../public/images/articles');

// Logger simples
function log(msg) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
  fs.appendFileSync(path.join(__dirname, 'auto-publisher.log'), `[${timestamp}] ${msg}\n`);
}

// 1. Buscar Notícias e Selecionar Tópico
async function getTrendingTopic() {
  log('🔍 Buscando notícias recentes em RSS feeds...');
  let articles = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      feed.items.forEach(item => {
        // Filtra notícias das últimas 24h
        const pubDate = new Date(item.pubDate);
        const now = new Date();
        const diffHours = (now - pubDate) / (1000 * 60 * 60);

        if (diffHours < 24) {
          articles.push({
            title: item.title,
            link: item.link,
            content: item.contentSnippet || item.content,
            pubDate: pubDate
          });
        }
      });
    } catch (error) {
      log(`Erro ao ler feed ${feedUrl}: ${error.message}`);
    }
  }

  // Ordenar por data (mais recente)
  articles.sort((a, b) => b.pubDate - a.pubDate);

  // Verificar se já falamos sobre isso (verificação simples por título nos arquivos existentes)
  // Ignora se encontrar palavra-chave similar nos últimos arquivos.
  // Esta parte é simplificada para MVP.

  if (articles.length === 0) {
    throw new Error('Nenhuma notícia recente encontrada.');
  }

  const selected = articles[0]; // Pega a mais recente
  log(`🎯 Tópico selecionado: ${selected.title}`);
  return selected;
}

// 2. Gerar Artigo com Google Gemini
async function generateArticleContent(topic) {
  log(`🧠 Gerando artigo completo com Gemini Pro sobre: ${topic.title}...`);

  const prompt = `
    Você é um especialista sênior em criptomoedas escrevendo para o blog 'A Cifra'.
    Escreva um artigo completo (>1600 palavras) baseado nesta notícia: "${topic.title}".
    Resumo da notícia: ${topic.content}

    Diretrizes:
    - Estrutura Markdown (H2, H3, bullets).
    - Tom profissional e educacional.
    - Foco em análise fundamentalista e impacto futuro (2025).
    - NÃO repita o título como H1. Comece com uma introdução engajante.
    - SEO Otimizado.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// 3. Gerar Metadados (Frontmatter) com Gemini
async function generateMetadata(topic, content) {
  log('🏷️ Gerando metadados com Gemini...');

  const prompt = `
    Analise este artigo sobre "${topic.title}" e gere um JSON com os seguintes campos:
    - title: Título SEO (max 60 chars)
    - excerpt: Meta description (max 160 chars)
    - tags: Array de strings (5-8 tags)
    - category: Uma categoria ("Criptomoedas", "DeFi", "NFTs", "Regulação", "Bitcoin", "Ethereum")
    - slug: URL slug (ex: titulo-do-artigo)

    Retorne APENAS o JSON válido, sem markdown code blocks.
  `;

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  // Limpeza caso venha com markdown
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();

  return JSON.parse(text);
}

// 4. Gerar Imagem com DALL-E 3 (OpenAI)
// Mantemos OpenAI para imagem pois a API do Gemini Vision foca em input, e Imagen 3 via API requer setup complexo de GCP.
async function generateImage(metadata) {
  log('🎨 Criando imagem de capa com DALL-E 3...');

  try {
    const prompt = `
      Editorial style illustration for a cryptocurrency news article titled "${metadata.title}".
      Theme: Modern, futuristic, digital finance, blockchain 3d render, high tech neon, 8k.
      No text in image. Wide aspect ratio 16:9.
    `;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    const imageUrl = response.data[0].url;
    const imageFileName = `${metadata.slug}-cover.png`;
    const imagePath = path.join(IMAGES_DIR, imageFileName);

    await downloadImage(imageUrl, imagePath);

    const webpFileName = `${metadata.slug}-cover.webp`;
    const webpPath = path.join(IMAGES_DIR, webpFileName);

    log('⚙️ Otimizando imagem para WebP...');
    await sharp(imagePath)
      .resize(1200, 630, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(webpPath);

    fs.unlinkSync(imagePath);
    return webpFileName;
  } catch (error) {
    log(`⚠️ Erro ao gerar imagem: ${error.message}. Usando fallback.`);
    return 'default-crypto-cover.webp'; // Fallback se falhar
  }
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', err => {
      fs.unlink(filepath);
      reject(err);
    });
  });
}

// 5. Traduzir com Gemini
async function translateContent(content, language) {
  log(`🌍 Traduzindo para ${language} com Gemini...`);

  const prompt = `
    Traduza o seguinte artigo Markdown para ${language}.
    Mantenha toda a formatação Markdown intacta.
    Adapte o tom para ser nativo e fluente.

    Artigo:
    ${content.substring(0, 30000)}
  `;
  // Gemini 1.5 Pro suporta context windows gigantes (1M tokens), então podemos passar o artigo inteiro sem medo.

  const result = await model.generateContent(prompt);
  return result.response.text();
}

function createMarkdownFile(lang, metadata, content, imageName) {
  const dateStr = new Date().toISOString();

  const fileContent = `---
title: "${metadata.title}"
excerpt: "${metadata.excerpt}"
date: "${dateStr}"
author:
  name: "A Cifra AI"
category:
  name: "${metadata.category}"
  color: "bg-blue-500"
tags: [${metadata.tags.map(t => `"${t}"`).join(', ')}]
coverImage:
  src: "/images/articles/${imageName}"
  alt: "${metadata.title}"
---

${content}
`;

  const dir = path.join(ARTICLES_DIR, lang);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${metadata.slug}.md`);
  fs.writeFileSync(filePath, fileContent);
  log(`💾 Arquivo salvo: ${filePath}`);
}

async function runBuild() {
  log('🏗️ Executando npm run build para validação...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    log('✅ Build bem-sucedido!');
    return true;
  } catch (error) {
    log('❌ Erro no build. Abortando deploy.');
    return false;
  }
}

async function deployToGit() {
  log('🚀 Iniciando deploy para o GitHub...');
  try {
    execSync('git add .');
    execSync('git commit -m "auto: New article generated by Gemini Auto-Publisher"');
    execSync('git push origin main');
    log('✅ Deploy enviado com sucesso!');
  } catch (error) {
    log(`❌ Erro no deploy: ${error.message}`);
  }
}

// === MAIN LOOP ===
async function main() {
  log('=== INICIANDO AUTO-PUBLISHER (GEMINI POWERED) ===');

  if (!process.env.GEMINI_API_KEY) {
    log('❌ ERRO: GEMINI_API_KEY não encontrada no .env');
    return;
  }

  try {
    const topic = await getTrendingTopic();

    const contentPT = await generateArticleContent(topic);
    const metadata = await generateMetadata(topic, contentPT);

    // Imagem ainda usa OpenAI se disponível, senão fallback
    let imageName = 'default-crypto-cover.webp';
    if (process.env.OPENAI_API_KEY) {
      imageName = await generateImage(metadata);
    } else {
      log('⚠️ OPENAI_API_KEY ausente. Pulando geração de imagem (usando default).');
    }

    createMarkdownFile('pt-BR', metadata, contentPT, imageName);

    // Traduções
    // Traduzir metadados para gerar arquivos corretos em EN/ES
    const metaEnRaw = await translateContent(JSON.stringify(metadata), "English");
    const metaEn = JSON.parse(metaEnRaw.replace(/```json/g, '').replace(/```/g, '').trim());
    const contentEN = await translateContent(contentPT, "English");
    createMarkdownFile('en', metaEn, contentEN, imageName);

    const metaEsRaw = await translateContent(JSON.stringify(metadata), "Spanish");
    const metaEs = JSON.parse(metaEsRaw.replace(/```json/g, '').replace(/```/g, '').trim());
    const contentES = await translateContent(contentPT, "Spanish");
    createMarkdownFile('es', metaEs, contentES, imageName);

    const buildSuccess = await runBuild();

    if (buildSuccess) {
      await deployToGit();
    } else {
      log('⚠️ Deploy cancelado devido a erro no build.');
    }

  } catch (error) {
    log(`❌ FALHA FATAL: ${error.message}`);
    console.error(error);
  }

  log('=== FIM DA EXECUÇÃO ===');
}

main();
```
