/**
 * Script para adicionar imagens de capa em artigos que não t
 * Uso:
 * node scripts/add-missing-covers.js --dry-run (apenas listar)
 * node scripts/add-missing-covers.js --update (atualizar)
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
  let inObject = false;

  for (const line of lines) {
    if (line.trim().startsWith('src:') || line.trim().startsWith('alt:')) {
      inObject = true;
    }

    if (line.match(/^[a-zA-Z]/) && !inObject) {
      if (currentKey) {
        frontmatter[currentKey] = currentValue.trim();
      }
      const [key, ...valueParts] = line.split(':');
      currentKey = key.trim();
      currentValue = valueParts.join(':').trim();
    } else if (currentKey) {
      currentValue += '\n' + line;
    }

    if (line.trim() === '' && inObject) {
      inObject = false;
    }
  }

  if (currentKey) {
    frontmatter[currentKey] = currentValue.trim();
  }

  return frontmatter;
}

/**
 * Verifica se artigo tem coverImage
 */
function hasCoverImage(content) {
  return /coverImage:\s*\n\s*src:/i.test(content);
}

/**
 * Encontra artigos sem imagem de capa
 */
function findArticlesWithoutCovers() {
  const articlesWithoutCovers = [];

  const files = fs.readdirSync(ARTICLES_DIR)
    .filter(file => file.endsWith('.md') && !file.endsWith('.en.md')); // Ignorar versões em inglês

  console.log(`📚 Analisando ${files.length} artigos...\n`);

  for (const file of files) {
    const filepath = path.join(ARTICLES_DIR, file);
    const content = fs.readFileSync(filepath, 'utf-8');

    if (!hasCoverImage(content)) {
      const frontmatter = extractFrontmatter(content);

      if (frontmatter) {
        const title = frontmatter.title?.replace(/['"]/g, '') || file;
        const slug = frontmatter.slug?.replace(/['"]/g, '') || file.replace('.md', '');
        const category = frontmatter.categorySlug?.replace(/['"]/g, '') || 'geral';

        articlesWithoutCovers.push({
          file,
          filepath,
          title,
          slug,
          category,
          content
        });
      }
    }
  }

  return articlesWithoutCovers;
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
 * Registra download (obrigatório pela API)
 */
async function trackDownload(downloadLocation) {
  return new Promise((resolve) => {
    const requestOptions = {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      }
    };

    https.get(downloadLocation, requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', () => resolve());
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
    bitcoin: 'bitcoin cryptocurrency blockchain',
    ethereum: 'ethereum blockchain crypto',
    defi: 'decentralized finance defi',
    nfts: 'nft digital art blockchain',
    altcoins: 'cryptocurrency altcoin',
    trading: 'cryptocurrency trading chart',
    seguranca: 'blockchain security lock',
    educacao: 'education learning technology',
    analises: 'analysis data chart cryptocurrency',
    memecoin: 'cryptocurrency meme coin',
    stablecoins: 'stablecoin usdt usdc finance',
    regulacao: 'regulation law government',
    tutoriais: 'tutorial guide technology'
  };

  const categoryQuery = categoryQueries[category] || 'cryptocurrency blockchain';

  // Extrair palavras-chave do título
  const keywords = title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3 && !['para', 'como', 'guia', 'sobre', 'the', 'and'].includes(word))
    .slice(0, 2)
    .join(' ');

  return `${categoryQuery} ${keywords}`.trim();
}

/**
 * Adiciona coverImage no frontmatter
 */
function addCoverImageToFile(filepath, imagePath, photo) {
  let content = fs.readFileSync(filepath, 'utf-8');

  // Encontrar o final do frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    console.log(`⚠️  Frontmatter não encontrado em ${filepath}`);
    return false;
  }

  const frontmatter = frontmatterMatch[1];
  const afterFrontmatter = content.substring(frontmatterMatch[0].length);

  // Adicionar coverImage antes do fechamento do frontmatter
  const newCoverImage = `coverImage:
  src: '${imagePath}'
  alt: '${(photo.alt_description || photo.description || 'Cryptocurrency image').replace(/'/g, "\\'")}'
  width: ${photo.width}
  height: ${photo.height}`;

  const newFrontmatter = `---\n${frontmatter}\n${newCoverImage}\n---`;
  const newContent = newFrontmatter + afterFrontmatter;

  fs.writeFileSync(filepath, newContent, 'utf-8');
  return true;
}

/**
 * Processa artigos sem imagem de capa
 */
async function processArticlesWithoutCovers(dryRun = true, limit = null) {
  const articles = findArticlesWithoutCovers();

  if (articles.length === 0) {
    console.log('✅ Todos os artigos já têm imagem de capa!');
    return;
  }

  console.log(`🔍 Encontrados ${articles.length} artigos sem imagem de capa:\n`);

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`${i + 1}. [${article.category}] ${article.title}`);
  }
  console.log('');

  if (dryRun) {
    console.log('ℹ️  Modo dry-run. Use --update para aplicar mudanças.\n');
    return;
  }

  // Verificar API key
  if (UNSPLASH_ACCESS_KEY === 'SUA_ACCESS_KEY_AQUI') {
    console.error('❌ Configure UNSPLASH_ACCESS_KEY para baixar imagens');
    console.log('\n📝 Como configurar:');
    console.log('1. Acesse: https://unsplash.com/developers');
    console.log('2. Crie um app');
    console.log('3. Copie a Access Key');
    console.log('4. Execute: $env:UNSPLASH_ACCESS_KEY="sua_chave"');
    return;
  }

  console.log('🔄 Iniciando atualização...\n');

  const articlesToProcess = limit ? articles.slice(0, limit) : articles;
  let updated = 0;
  let failed = 0;

  for (const article of articlesToProcess) {
    try {
      console.log(`\n📝 Processando: ${article.title}`);
      console.log(`📁 Categoria: ${article.category}`);

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
      console.log(`👤 Por: ${photo.user.name} (@${photo.user.username})`);
      console.log(`📏 Tamanho: ${photo.width}x${photo.height}`);

      // Registrar download (obrigatório)
      await trackDownload(photo.links.download_location);

      // Gerar nome único para imagem
      const timestamp = Date.now();
      const filename = `${article.slug}-${timestamp}.jpg`;
      const newImagePath = `/images/articles/${filename}`;
      const filepath = path.join(process.cwd(), 'public', 'images', 'articles', filename);

      // Criar diretório se não existir
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

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
        console.log(`⚠️  Estilo não aplicado: ${error.message}`);
        console.log(`💡 Instale Sharp: npm install sharp`);
      }

      // Atualizar arquivo markdown
      console.log(`📝 Atualizando artigo...`);
      const success = addCoverImageToFile(article.filepath, newImagePath, photo);

      if (success) {
        console.log(`✅ Atualizado com sucesso!`);
        updated++;
      } else {
        console.log(`❌ Falha ao atualizar frontmatter`);
        failed++;
      }

      // Aguardar 1 segundo entre requisições (rate limit)
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`❌ Erro ao processar ${article.title}:`, error.message);
      failed++;
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`✅ Atualizados: ${updated}`);
  console.log(`❌ Falhas: ${failed}`);
  console.log(`📸 Total processado: ${articlesToProcess.length}`);
}

/**
 * Função principal
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📸 Add Missing Covers

Adiciona imagens de capa automaticamente em artigos que não têm.

Uso:
  node scripts/add-missing-covers.js [opções]

Opções:
  --dry-run         Apenas lista artigos sem capa (padrão)
  --update          Adiciona imagens do Unsplash
  --limit [n]       Processa apenas N artigos
  --help, -h        Mostra esta ajuda

Exemplos:
  # Listar artigos sem capa
  node scripts/add-missing-covers.js

  # Adicionar capas em todos
  node scripts/add-missing-covers.js --update

  # Adicionar capas em 5 artigos
  node scripts/add-missing-covers.js --update --limit 5

⚠️  Requer:
  - UNSPLASH_ACCESS_KEY configurada
  - Sharp instalado (npm install sharp) para aplicar estilo
    `);
    return;
  }

  const dryRun = !args.includes('--update');
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex !== -1 && args[limitIndex + 1] ? parseInt(args[limitIndex + 1]) : null;

  try {
    await processArticlesWithoutCovers(dryRun, limit);
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
  findArticlesWithoutCovers,
  processArticlesWithoutCovers
};
