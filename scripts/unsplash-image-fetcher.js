/**
 * Script para buscar imagens doara artigos
 *
 * Uso:
 * node scripts/unsplash-image-fetcher.js "bitcoin cryptocurrency" --save
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuração
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'SUA_ACCESS_KEY_AQUI';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

/**
 * Busca imagens no Unsplash
 */
async function searchPhotos(query, options = {}) {
  const {
    perPage = 20,
    orientation = 'landscape',
    orderBy = 'relevant'
  } = options;

  const params = new URLSearchParams({
    query: query,
    per_page: perPage,
    orientation: orientation,
    order_by: orderBy
  });

  const url = `${UNSPLASH_API_URL}/search/photos?${params.toString()}`;

  return new Promise((resolve, reject) => {
    const requestOptions = {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      }
    };

    https.get(url, requestOptions, (res) => {
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
 * Registra download da imagem (obrigatório pela API do Unsplash)
 */
async function trackDownload(downloadLocation) {
  return new Promise((resolve, reject) => {
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
    }).on('error', reject);
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
  if (!results.results || results.results.length === 0) {
    return 'Nenhuma imagem encontrada.';
  }

  let output = `\n📸 Encontradas ${results.total} imagens (mostrando ${results.results.length}):\n\n`;

  results.results.forEach((photo, index) => {
    output += `${index + 1}. ${photo.description || photo.alt_description || 'Sem descrição'}\n`;
    output += `   Tamanho: ${photo.width}x${photo.height}\n`;
    output += `   Likes: ${photo.likes.toLocaleString()}\n`;
    output += `   Views: ${photo.views ? photo.views.toLocaleString() : 'N/A'}\n`;
    output += `   Downloads: ${photo.downloads ? photo.downloads.toLocaleString() : 'N/A'}\n`;
    output += `   URL: ${photo.urls.regular}\n`;
    output += `   Autor: ${photo.user.name} (@${photo.user.username})\n`;
    output += `   Perfil: ${photo.user.links.html}\n\n`;
  });

  return output;
}

/**
 * Salva imagem para uso no site
 */
async function saveImageForArticle(photo, filename) {
  const publicDir = path.join(process.cwd(), 'public', 'images', 'articles');

  // Criar diretório se não existir
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const filepath = path.join(publicDir, filename);

  console.log(`📥 Baixando imagem para: ${filepath}`);

  // Registrar download (obrigatório pela API)
  await trackDownload(photo.links.download_location);

  // Baixar imagem em alta qualidade
  await downloadImage(photo.urls.regular, filepath);

  console.log(`✅ Imagem salva com sucesso!`);

  return {
    path: `/images/articles/${filename}`,
    photo: photo
  };
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
  memecoin: 'cryptocurrency meme',
  stablecoins: 'stablecoin money finance',
  regulacao: 'regulation law government'
};

/**
 * Função principal
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📸 Unsplash Image Fetcher para A Cifra

Uso:
  node scripts/unsplash-image-fetcher.js "termo de busca" [opções]
  node scripts/unsplash-image-fetcher.js --category bitcoin [opções]

Opções:
  --save [filename]    Salva a primeira imagem com o nome especificado
  --category [cat]     Usa query pré-definida para categoria
  --count [n]          Número de resultados (padrão: 20)

Exemplos:
  node scripts/unsplash-image-fetcher.js "bitcoin cryptocurrency"
  node scripts/unsplash-image-fetcher.js --category bitcoin --save bitcoin-cover.jpg
  node scripts/unsplash-image-fetcher.js "ethereum" --save eth-article.jpg --count 10

Categorias disponíveis:
  ${Object.keys(categoryQueries).join(', ')}

⚠️  Configure sua Access Key do Unsplash:
  1. Acesse: https://unsplash.com/developers
  2. Crie um aplicativo (Demo é suficiente)
  3. Copie sua Access Key
  4. Configure: export UNSPLASH_ACCESS_KEY="sua_chave_aqui"
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

  // Verificar Access Key
  if (UNSPLASH_ACCESS_KEY === 'SUA_ACCESS_KEY_AQUI') {
    console.error('❌ Erro: Configure sua Access Key do Unsplash');
    console.log('\n📝 Como obter sua Access Key:');
    console.log('1. Acesse: https://unsplash.com/developers');
    console.log('2. Clique em "New Application"');
    console.log('3. Aceite os termos (Demo é suficiente)');
    console.log('4. Copie sua "Access Key"');
    console.log('5. Configure: export UNSPLASH_ACCESS_KEY="sua_chave"');
    process.exit(1);
  }

  try {
    console.log(`🔍 Buscando imagens para: "${query}"\n`);

    const results = await searchPhotos(query, { perPage: count });

    console.log(formatResults(results));

    // Salvar imagem se solicitado
    if (saveFilename && results.results && results.results.length > 0) {
      const bestPhoto = results.results[0]; // Primeira imagem (mais relevante)
      const result = await saveImageForArticle(bestPhoto, saveFilename);

      console.log(`\n✅ Imagem salva em: ${result.path}`);
      console.log(`\n📋 Use no frontmatter do artigo:`);
      console.log(`coverImage:`);
      console.log(`  src: '${result.path}'`);
      console.log(`  alt: '${bestPhoto.alt_description || bestPhoto.description || query}'`);
      console.log(`  width: ${bestPhoto.width}`);
      console.log(`  height: ${bestPhoto.height}`);
      console.log(`\n👤 Créditos (OBRIGATÓRIO):`);
      console.log(`Foto por ${bestPhoto.user.name} no Unsplash`);
      console.log(`Link: ${bestPhoto.user.links.html}`);
      console.log(`\n📝 Adicione no final do artigo:`);
      console.log(`*Foto de capa por [${bestPhoto.user.name}](${bestPhoto.user.links.html}) no [Unsplash](https://unsplash.com)*`);
    }

  } catch (error) {
    console.error('❌ Erro ao buscar imagens:', error.message);

    if (error.message.includes('401')) {
      console.log('\n⚠️  Erro de autenticação. Verifique sua Access Key.');
    }

    process.exit(1);
  }
}

// Executar
if (require.main === module) {
  main();
}

module.exports = {
  searchPhotos,
  downloadImage,
  saveImageForArticle,
  trackDownload,
  categoryQueries
};

