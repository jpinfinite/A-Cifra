/**
 * Script para buscar imagens do Pixabay para artigos
 *
 * Uso:
 * nscripts/pixabay-image-fetcher.js "bitcoin cryptocurrency" --save
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuração
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || '23496579-54ca405176c26b14c46e50217';
const PIXABAY_API_URL = 'https://pixabay.com/api/';

/**
 * Busca imagens no Pixabay
 */
async function searchImages(query, options = {}) {
  const {
    perPage = 20,
    imageType = 'photo',
    orientation = 'horizontal',
    minWidth = 1200,
    minHeight = 630,
    safesearch = true
  } = options;

  const params = new URLSearchParams({
    key: PIXABAY_API_KEY,
    q: query,
    image_type: imageType,
    orientation: orientation,
    min_width: minWidth,
    min_height: minHeight,
    safesearch: safesearch,
    per_page: perPage,
    lang: 'pt'
  });

  const url = `${PIXABAY_API_URL}?${params.toString()}`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Baixa uma imagem
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
 * Formata resultado para exibição
 */
function formatResults(results) {
  if (!results.hits || results.hits.length === 0) {
    return 'Nenhuma imagem encontrada.';
  }

  let output = `\n📸 Encontradas ${results.totalHits} imagens (mostrando ${results.hits.length}):\n\n`;

  results.hits.forEach((image, index) => {
    output += `${index + 1}. ${image.tags}\n`;
    output += `   Tamanho: ${image.imageWidth}x${image.imageHeight}\n`;
    output += `   Visualizações: ${image.views.toLocaleString()}\n`;
    output += `   Likes: ${image.likes.toLocaleString()}\n`;
    output += `   URL: ${image.largeImageURL}\n`;
    output += `   Autor: ${image.user} (${image.userImageURL})\n\n`;
  });

  return output;
}

/**
 * Salva imagem para uso no site
 */
async function saveImageForArticle(imageUrl, filename) {
  const publicDir = path.join(process.cwd(), 'public', 'images', 'articles');

  // Criar diretório se não existir
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const filepath = path.join(publicDir, filename);

  console.log(`📥 Baixando imagem para: ${filepath}`);
  await downloadImage(imageUrl, filepath);
  console.log(`✅ Imagem salva com sucesso!`);

  return `/images/articles/${filename}`;
}

/**
 * Busca imagens por categoria de artigo
 */
const categoryQueries = {
  bitcoin: 'bitcoin cryptocurrency blockchain',
  ethereum: 'ethereum crypto blockchain',
  defi: 'decentralized finance crypto',
  nfts: 'nft digital art blockchain',
  altcoins: 'cryptocurrency altcoin',
  trading: 'trading chart cryptocurrency',
  seguranca: 'security lock blockchain',
  educacao: 'education learning technology',
  analises: 'analysis chart data',
  memecoin: 'cryptocurrency meme coin',
  stablecoins: 'stablecoin usdt usdc',
  regulacao: 'regulation law government'
};

/**
 * Função principal
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📸 Pixabay Image Fetcher para A Cifra

Uso:
  node scripts/pixabay-image-fetcher.js "termo de busca" [opções]
  node scripts/pixabay-image-fetcher.js --category bitcoin [opções]

Opções:
  --save [filename]    Salva a primeira imagem com o nome especificado
  --category [cat]     Usa query pré-definida para categoria
  --count [n]          Número de resultados (padrão: 20)

Exemplos:
  node scripts/pixabay-image-fetcher.js "bitcoin cryptocurrency"
  node scripts/pixabay-image-fetcher.js --category bitcoin --save bitcoin-cover.jpg
  node scripts/pixabay-image-fetcher.js "ethereum" --save eth-article.jpg --count 10

Categorias disponíveis:
  ${Object.keys(categoryQueries).join(', ')}

⚠️  Configure sua API key do Pixabay:
  export PIXABAY_API_KEY="sua_chave_aqui"
  ou edite o arquivo e adicione diretamente
    `);
    process.exit(0);
  }

  // Parse argumentos
  let query = '';
  let saveFilename = null;
  let count = 20;
  let category = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--save' && args[i + 1]) {
      saveFilename = args[i + 1];
      i++;
    } else if (args[i] === '--category' && args[i + 1]) {
      category = args[i + 1];
      query = categoryQueries[category] || args[i + 1];
      i++;
    } else if (args[i] === '--count' && args[i + 1]) {
      count = parseInt(args[i + 1]);
      i++;
    } else if (!args[i].startsWith('--')) {
      query = args[i];
    }
  }

  if (!query) {
    console.error('❌ Erro: Especifique um termo de busca ou categoria');
    process.exit(1);
  }

  // Verificar API key
  if (PIXABAY_API_KEY === 'SUA_API_KEY_AQUI') {
    console.error('❌ Erro: Configure sua API key do Pixabay');
    console.log('\n📝 Como obter sua API key:');
    console.log('1. Acesse: https://pixabay.com/api/docs/');
    console.log('2. Crie uma conta gratuita');
    console.log('3. Copie sua API key');
    console.log('4. Configure: export PIXABAY_API_KEY="sua_chave"');
    process.exit(1);
  }

  try {
    console.log(`🔍 Buscando imagens para: "${query}"\n`);

    const results = await searchImages(query, { perPage: count });

    console.log(formatResults(results));

    // Salvar imagem se solicitado
    if (saveFilename && results.hits && results.hits.length > 0) {
      const bestImage = results.hits[0]; // Primeira imagem (melhor ranqueada)
      const imagePath = await saveImageForArticle(bestImage.largeImageURL, saveFilename);

      console.log(`\n✅ Imagem salva em: ${imagePath}`);
      console.log(`\n📋 Use no frontmatter do artigo:`);
      console.log(`coverImage:`);
      console.log(`  src: '${imagePath}'`);
      console.log(`  alt: '${bestImage.tags}'`);
      console.log(`  width: ${bestImage.imageWidth}`);
      console.log(`  height: ${bestImage.imageHeight}`);
      console.log(`\n👤 Créditos (opcional):`);
      console.log(`Imagem por ${bestImage.user} via Pixabay`);
    }

  } catch (error) {
    console.error('❌ Erro ao buscar imagens:', error.message);
    process.exit(1);
  }
}

// Executar
if (require.main === module) {
  main();
}

module.exports = {
  searchImages,
  downloadImage,
  saveImageForArticle,
  categoryQueries
};

