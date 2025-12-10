/**
 * Script para identificar e substituir imagens de capa duplicadas
 *
 * Uso:
 * node scripts/update-duplicate-covers.js --dry-run (aar)
 * node scripts/update-duplicate-covers.js --update (atualizar)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuração
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'SUA_ACCESS_KEY_AQUI';
const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

/**
 * Extrai frontmatter de um arquivo markdown
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let currentValue = '';

  for (const line of lines) {
    if (line.match(/^[a-zA-Z]/)) {
      if (currentKey) {
        frontmatter[currentKey] = currentValue.trim();
      }
      const [key, ...valueParts] = line.split(':');
      currentKey = key.trim();
      currentValue = valueParts.join(':').trim();
    } else if (currentKey) {
      currentValue += '\n' + line;
    }
  }

  if (currentKey) {
    frontmatter[currentKey] = currentValue.trim();
  }

  return frontmatter;
}

/**
 * Extrai informações de coverImage do frontmatter
 */
function extractCoverImage(frontmatter) {
  const content = JSON.stringify(frontmatter);
  const srcMatch = content.match(/src['":\s]+['"]([^'"]+)['"]/);

  if (srcMatch) {
    return srcMatch[1];
  }

  return null;
}

/**
 * Analisa todos os artigos e encontra duplicatas
 */
function findDuplicateCovers() {
  const articles = [];
  const imageCount = {};

  const files = fs.readdirSync(ARTICLES_DIR)
    .filter(file => file.endsWith('.md'));

  console.log(`📚 Analisando ${files.length} artigos...\n`);

  for (const file of files) {
    const filepath = path.join(ARTICLES_DIR, file);
    const content = fs.readFileSync(filepath, 'utf-8');
    const frontmatter = extractFrontmatter(content);

    if (!frontmatter) continue;

    const coverImage = extractCoverImage(frontmatter);
    const title = frontmatter.title?.replace(/['"]/g, '') || file;
    const slug = frontmatter.slug?.replace(/['"]/g, '') || file.replace('.md', '');
    const category = frontmatter.categorySlug?.replace(/['"]/g, '') || 'geral';

    if (coverImage) {
      articles.push({
        file,
        filepath,
        title,
        slug,
        category,
        coverImage,
        content
      });

      imageCount[coverImage] = (imageCount[coverImage] || 0) + 1;
    }
  }

  // Encontrar duplicatas
  const duplicates = Object.entries(imageCount)
    .filter(([img, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);

  return { articles, duplicates, imageCount };
}

/**
 * Busca imagem no Unsplash
 */
async function searchUnsplashImage(query) {
  const params = new URLSearchParams({
    query: query,
    per_page: 1,
    orientation: 'landscape',
    order_by: 'relevant'
  });

  const url = `https://api.unsplash.com/search/photos?${params.toString()}`;

  return new Promise((resolve, reject) => {
    const requestOptions = {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      }
    };

    https.get(url, requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.results && result.results.length > 0) {
            resolve(result.results[0]);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Baixa imagem
 */
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (error) => {
      fs.unlink(filepath, () => {});
      reject(error);
    });
  });
}

/**
 * Gera query de busca baseada no título e categoria
 */
function generateSearchQuery(title, category) {
  const categoryQueries = {
    bitcoin: 'bitcoin cryptocurrency',
    ethereum: 'ethereum blockchain',
    defi: 'decentralized finance',
    nfts: 'nft digital art',
    altcoins: 'cryptocurrency altcoin',
    trading: 'trading chart',
    seguranca: 'security blockchain',
    educacao: 'education technology',
    analises: 'analysis data chart',
    memecoin: 'cryptocurrency',
    stablecoins: 'stablecoin finance',
    regulacao: 'regulation law'
  };

  const categoryQuery = categoryQueries[category] || 'cryptocurrency';

  // Extrair palavras-chave do título
  const keywords = title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3)
    .slice(0, 2)
    .join(' ');

  return `${categoryQuery} ${keywords}`.trim();
}

/**
 * Atualiza coverImage no arquivo markdown
 */
function updateCoverImageInFile(filepath, newImagePath, photo) {
  let content = fs.readFileSync(filepath, 'utf-8');

  // Encontrar e substituir coverImage
  const coverImageRegex = /coverImage:\s*\n\s*src:\s*['"]([^'"]+)['"]\s*\n\s*alt:\s*['"]([^'"]+)['"]/;

  const newCoverImage = `coverImage:
  src: '${newImagePath}'
  alt: '${photo.alt_description || photo.description || 'Cryptocurrency image'}'`;

  if (coverImageRegex.test(content)) {
    content = content.replace(coverImageRegex, newCoverImage);
  }

  fs.writeFileSync(filepath, content, 'utf-8');
}

/**
 * Processa artigos com imagens duplicadas
 */
async function processDuplicates(dryRun = true) {
  const { articles, duplicates } = findDuplicateCovers();

  if (duplicates.length === 0) {
    console.log('✅ Nenhuma imagem duplicada encontrada!');
    return;
  }

  console.log(`🔍 Encontradas ${duplicates.length} imagens duplicadas:\n`);

  for (const [imagePath, count] of duplicates) {
    console.log(`📸 ${imagePath} - usado em ${count} artigos`);

    const articlesWithImage = articles.filter(a => a.coverImage === imagePath);

    for (let i = 0; i < articlesWithImage.length; i++) {
      const article = articlesWithImage[i];
      console.log(`   ${i + 1}. ${article.title}`);
    }
    console.log('');
  }

  if (dryRun) {
    console.log('ℹ️  Modo dry-run. Use --update para aplicar mudanças.\n');
    return;
  }

  // Verificar API key
  if (UNSPLASH_ACCESS_KEY === 'SUA_ACCESS_KEY_AQUI') {
    console.error('❌ Configure UNSPLASH_ACCESS_KEY para baixar novas imagens');
    return;
  }

  console.log('🔄 Iniciando atualização...\n');

  let updated = 0;
  let failed = 0;

  for (const [imagePath, count] of duplicates) {
    const articlesWithImage = articles.filter(a => a.coverImage === imagePath);

    // Manter a primeira, atualizar as demais
    for (let i = 1; i < articlesWithImage.length; i++) {
      const article = articlesWithImage[i];

      try {
        console.log(`\n📝 Processando: ${article.title}`);

        // Gerar query de busca
        const query = generateSearchQuery(article.title, article.category);
        console.log(`🔍 Buscando: "${query}"`);

        // Buscar imagem no Unsplash
        const photo = await searchUnsplashImage(query);

        if (!photo) {
          console.log(`⚠️  Nenhuma imagem encontrada`);
          failed++;
          continue;
        }

        console.log(`✅ Encontrada: ${photo.alt_description || 'Sem descrição'}`);
        console.log(`👤 Por: ${photo.user.name}`);

        // Gerar nome único para imagem
        const timestamp = Date.now();
        const filename = `${article.slug}-${timestamp}.jpg`;
        const newImagePath = `/images/articles/${filename}`;
        const filepath = path.join(process.cwd(), 'public', 'images', 'articles', filename);

        // Baixar imagem
        console.log(`📥 Baixando...`);
        await downloadImage(photo.urls.regular, filepath);

        // Aplicar estilo A Cifra (se Sharp estiver instalado)
        try {
          const styleScript = require('./apply-cover-style');
          const tempPath = filepath.replace('.jpg', '-temp.jpg');
          fs.renameSync(filepath, tempPath);

          console.log(`🎨 Aplicando estilo A Cifra...`);
          await styleScript.applyCoverStyle(tempPath, filepath);
          fs.unlinkSync(tempPath);
        } catch (error) {
          console.log(`⚠️  Estilo não aplicado (Sharp não instalado)`);
        }

        // Atualizar arquivo markdown
        console.log(`📝 Atualizando artigo...`);
        updateCoverImageInFile(article.filepath, newImagePath, photo);

        console.log(`✅ Atualizado com sucesso!`);
        updated++;

        // Aguardar 1 segundo entre requisições (rate limit)
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Erro ao processar ${article.title}:`, error.message);
        failed++;
      }
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`✅ Atualizados: ${updated}`);
  console.log(`❌ Falhas: ${failed}`);
  console.log(`📸 Total de duplicatas resolvidas: ${duplicates.length}`);
}

/**
 * Função principal
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🔄 Update Duplicate Covers

Identifica e substitui imagens de capa duplicadas nos artigos.

Uso:
  node scripts/update-duplicate-covers.js [opções]

Opções:
  --dry-run    Apenas lista duplicatas sem fazer mudanças (padrão)
  --update     Atualiza artigos com novas imagens do Unsplash
  --help, -h   Mostra esta ajuda

Exemplos:
  # Listar duplicatas
  node scripts/update-duplicate-covers.js
  node scripts/update-duplicate-covers.js --dry-run

  # Atualizar artigos
  node scripts/update-duplicate-covers.js --update

⚠️  Requer:
  - UNSPLASH_ACCESS_KEY configurada
  - Sharp instalado (npm install sharp) para aplicar estilo
    `);
    return;
  }

  const dryRun = !args.includes('--update');

  try {
    await processDuplicates(dryRun);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

// Executar
if (require.main === module) {
  main();
}

module.exports = {
  findDuplicateCovers,
  processDuplicates
};

