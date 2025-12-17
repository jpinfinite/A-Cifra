const Parser = require('rss-parser');
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

// Inicializar Gemini
// Nota: O usuário pode não ter a chave ainda, vamos tratar isso no main()
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

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

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const prompt = `
    Você é um especialista sênior em criptomoedas, DeFi e Web3 escrevendo para o blog 'A Cifra'.
    Escreva um artigo completo (>1600 palavras) baseado nesta notícia: "${topic.title}".
    Resumo da notícia: ${topic.content}

    Diretrizes:
    - O artigo deve ser longo, técnico e educativo.
    - Estrutura Markdown (H2, H3, bullets).
    - Tom profissional, autoritativo e otimista (mas realista).
    - Foco em análise fundamentalista, tokenomics e impacto futuro.
    - NÃO repita o título como H1. Comece com uma introdução engajante.
    - Otimize para SEO e Google Discover.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// 3. Gerar Metadados (Frontmatter) com Gemini
async function generateMetadata(topic, content) {
  log('🏷️ Gerando metadados com Gemini...');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const prompt = `
    Analise este artigo sobre "${topic.title}" e gere um JSON com os seguintes campos:
    - title: Título SEO (max 60 chars, clickbait saudável)
    - excerpt: Meta description (max 160 chars)
    - tags: Array de strings (5-8 tags)
    - category: Escolha UMA: "Criptomoedas", "DeFi", "NFTs", "Regulação", "Bitcoin", "Ethereum", "Altcoins"
    - slug: URL slug (ex: titulo-do-artigo)

    Retorne APENAS o JSON válido, sem markdown code blocks.
  `;

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  // Limpeza caso venha com markdown
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(text);
  } catch (e) {
    log('Erro ao parsear JSON dos metadados. Tentando fallback simples.');
    return {
      title: topic.title,
      excerpt: topic.content.substring(0, 150),
      tags: ['Crypto', 'News'],
      category: 'Criptomoedas',
      slug: slugify(topic.title)
    };
  }
}

// 4. Gerar Imagem Gratuita (Pollinations.ai)
async function generateImage(metadata) {
  log('🎨 Criando imagem de capa Gratuita (Pollinations/Flux)...');

  // Prompt otimizado para renderizadores artísticos como Flux/Midjourney style
  const prompt = `cinematic shot, crypto news illustration about ${metadata.title}, futuristic, blockchain, ethereum style, high tech, neon accents, 3d render, 8k resolution, highly detailed, dramatic lighting, aspect ratio 16:9`;

  // Usamos o modelo 'flux' que é excelente e gratuito via Pollinations
  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&model=flux&seed=${Math.floor(Math.random() * 1000)}`;

  const imageFileName = `${metadata.slug}-cover.png`;
  const imagePath = path.join(IMAGES_DIR, imageFileName);

  try {
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
    return 'default-crypto-cover.webp';
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
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

// 5. Traduzir com Gemini
async function translateContent(content, language) {
  log(`🌍 Traduzindo para ${language} com Gemini...`);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const prompt = `
    Traduza o seguinte artigo Markdown para ${language}.
    Mantenha toda a formatação Markdown intacta.
    Adapte o tom para ser nativo e fluente para um público investidor.

    Artigo:
    ${content.substring(0, 30000)}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

function createMarkdownFile(lang, metadata, content, imageName) {
  const dateStr = new Date().toISOString();
  // Se for tradução, podemos adaptar o título se tivermos, mas vamos usar o título original por enquanto ou traduzir depois

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
  log('=== INICIANDO AUTO-PUBLISHER (GEMINI + POLLINATIONS) ===');

  if (!process.env.GEMINI_API_KEY) {
    log('❌ ERRO: GEMINI_API_KEY não encontrada no .env. Configure-a para continuar.');
    log('Obtenha em: https://aistudio.google.com/app/apikey');
    return; // Aborta se não tiver chave
  }

  try {
    const topic = await getTrendingTopic();

    const contentPT = await generateArticleContent(topic);
    const metadata = await generateMetadata(topic, contentPT);

    // Imagem via Pollinations (Gratuito)
    const imageName = await generateImage(metadata);

    createMarkdownFile('pt-BR', metadata, contentPT, imageName);

    // Traduções
    // Para simplificar, vamos usar os mesmos metadados traduzidos apenas no conteúdo
    // Mas idealmente traduziríamos o título e excerpt também.
    // Vamos fazer um quick-translate dos metadados para inglês e espanhol para manter qualidade.

    // EN
    const metaEnRaw = await translateContent(JSON.stringify(metadata), "English");
    let metaEn = metadata;
    try {
        metaEn = JSON.parse(metaEnRaw.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch(e) {}

    const contentEN = await translateContent(contentPT, "English");
    createMarkdownFile('en', metaEn, contentEN, imageName);

    // ES
    const metaEsRaw = await translateContent(JSON.stringify(metadata), "Spanish");
    let metaEs = metadata;
    try {
        metaEs = JSON.parse(metaEsRaw.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch(e) {}

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
