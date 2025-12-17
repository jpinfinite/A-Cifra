const Parser = require('rss-parser');
const OpenAI = require('openai');
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

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// 2. Gerar Artigo com IA
async function generateArticleContent(topic) {
  log(`🧠 Gerando artigo completo sobre: ${topic.title}...`);

  const systemPrompt = `
    Você é um especialista sênior em criptomoedas, blockchain e finanças descentralizadas (DeFi) escrevendo para o blog 'A Cifra'.
    Seu objetivo é escrever artigos altamente técnicos, educacionais e otimizados para SEO e Google Discover.

    Diretrizes:
    - O artigo deve ter MAIS DE 1600 PALAVRAS. Isso é mandatório.
    - Estrutura: Introdução ganchuda, H2s explicativos, H3s detalhados, Listas (bullets), e Conclusão.
    - Tom de voz: Profissional, autoritativo, mas acessível.
    - Use Markdown.
    - NÃO inclua o título H1 no corpo do texto (ele irá no frontmatter).
    - Inclua uma chamada para ação (CTA) no final.
    - Otimize para palavras-chave relacionadas à notícia.
  `;

  const userPrompt = `
    Escreva um artigo completo e profundo baseado nesta notícia recente: "${topic.title}".
    Contexto adicional: ${topic.content}

    O artigo deve focar em:
    1. O que aconteceu (fatos).
    2. Por que isso importa (análise fundamentalista).
    3. Impacto no mercado e preços.
    4. Perspectivas futuras (2025+).
    5. Aspectos técnicos (se aplicável).

    Retorne APENAS o conteúdo em Markdown, sem blocos de código (ex: não use \`\`\`markdown).
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview", // Use modelo turbo para contextos longos
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

// 3. Gerar Metadados (Frontmatter)
async function generateMetadata(topic, content) {
  log('🏷️ Gerando metadados e título SEO...');

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Gere metadados JSON para um artigo de blog sobre cripto." },
      { role: "user", content: `
        Baseado neste título de notícia: "${topic.title}" e neste conteúdo (início): "${content.substring(0, 500)}...",
        Gere um objeto JSON com:
        - title: Um título SEO altamente clicável e atraente (máx 60 chars).
        - excerpt: Um resumo curto e instigante para meta description (máx 160 chars).
        - tags: Array de 5-8 tags relevantes.
        - category: Uma destas categorias: "Criptomoedas", "DeFi", "NFTs", "Metaverso", "Regulação", "Segurança", "Blockchain", "Tecnologia".
        - slug: Um slug URL-friendly.
      `}
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

// 4. Gerar Imagem com DALL-E 3
async function generateImage(metadata) {
  log('🎨 Criando imagem de capa com IA...');

  const prompt = `
    Editorial style illustration for a cryptocurrency news article titled "${metadata.title}".
    Theme: Modern, futuristic, digital finance, blockchain, ethereum style, high tech, neon accents, 3d render, 8k resolution, cinematic lighting.
    No text, no letters, no words in the image.
    Aspect ratio: Wide (16:9).
  `;

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024", // DALL-E 3 standard
    quality: "standard",
    response_format: "url",
  });

  const imageUrl = response.data[0].url;
  const imageFileName = `${metadata.slug}-cover.png`; // Baixamos como PNG primeiro
  const imagePath = path.join(IMAGES_DIR, imageFileName);

  // Download da imagem
  await downloadImage(imageUrl, imagePath);

  // Otimizar para WebP
  const webpFileName = `${metadata.slug}-cover.webp`;
  const webpPath = path.join(IMAGES_DIR, webpFileName);

  log('⚙️ Otimizando imagem para WebP...');
  await sharp(imagePath)
    .resize(1200, 630, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(webpPath);

  // Remove PNG original para economizar espaço
  fs.unlinkSync(imagePath);

  return webpFileName;
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

// 5. Traduzir Artigo
async function translateContent(content, language) {
  log(`🌍 Traduzindo para ${language}...`);
  // Usaremos GPT-3.5-turbo para tradução por ser mais rápido e barato para textos longos
  // Dividimos em chunks se necessário (simplificado aqui para 1 chunk large context)

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    messages: [
      { role: "system", content: `Você é um tradutor profissional expert em criptomoedas. Traduza o seguinte texto Markdown para ${language}. Mantenha a formatação Markdown intacta.` },
      { role: "user", content: content }
    ]
  });

  return completion.choices[0].message.content;
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
    execSync('git commit -m "auto: New article generated by Auto-Publisher"');
    execSync('git push origin main');
    log('✅ Deploy enviado com sucesso!');
  } catch (error) {
    log(`❌ Erro no deploy: ${error.message}`);
  }
}

// === MAIN LOOP ===
async function main() {
  log('=== INICIANDO AUTO-PUBLISHER ===');

  try {
    // 1. Tópico
    const topic = await getTrendingTopic();

    // 2. Conteúdo PT-BR
    const contentPT = await generateArticleContent(topic);
    const metadata = await generateMetadata(topic, contentPT);

    // 3. Imagem
    const imageName = await generateImage(metadata);

    // 4. Salvar PT-BR
    createMarkdownFile('pt-BR', metadata, contentPT, imageName);

    // 5. Traduzir e Salvar EN
    const metadataEN = { ...metadata }; // Em um mundo ideal traduziríamos o título também, mas vamos manter simples por enquanto ou usar a mesma função de tradução
    // Traduzir metadados rapidinho
    const metaEnRaw = await translateContent(JSON.stringify(metadata), "English");
    const metaEn = JSON.parse(metaEnRaw);
    const contentEN = await translateContent(contentPT, "English");
    createMarkdownFile('en', metaEn, contentEN, imageName);

    // 6. Traduzir e Salvar ES
    const metaEsRaw = await translateContent(JSON.stringify(metadata), "Spanish");
    const metaEs = JSON.parse(metaEsRaw);
    const contentES = await translateContent(contentPT, "Spanish");
    createMarkdownFile('es', metaEs, contentES, imageName);

    // 7. Validar
    const buildSuccess = await runBuild();

    // 8. Deploy
    if (buildSuccess) {
      await deployToGit();
    } else {
      // Se falhar, talvez devêssemos reverter os arquivos criados?
      // Por enquanto, deixamos lá para debug.
      log('⚠️ Deploy cancelado devido a erro no build.');
    }

  } catch (error) {
    log(`❌ FALHA FATAL: ${error.message}`);
    if (error.response) console.error(error.response.data);
  }

  log('=== FIM DA EXECUÇÃO ===');
}

main();
