/**
 * Script para buscar imagens do Pexels para artigos
 *
 * Uso:
 *ripts/pexels-image-fetcher.js "bitcoin cryptocurrency" --save
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuração
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '9qRIa6tpUGXqUizPGdA00WPQhBu9eCC8CatJ5JaKmeERm5BjfbaeWJm5';
const PEXELS_API_URL = 'https://api.pexels.com/v1';

/**
 * Busca fotos no Pexels
 */
async function searchPhotos(query, options = {}) {
  const {
    perPage = 20,
    orientation = 'landscape',
    size = 'large'
  } = options;

  const params = new URLSearchParams({
    query: query,
    per_page: perPage,
    orientation: orientation,
    size: size
  });

  const url = `${PEXELS_API_URL}/search?${params.toString()}`;

  return new Promise((resolve, reject) => {
    const requestOptions = {
      headers: {
        'Authorization': PEXELS_API_KEY
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
  if (!results.photos || results.photos.length === 0) {
    return 'Nenhuma foto encontrada.';
  }

  let output = `\n📸 Encontradas ${results.total_results} fotos (mostrando ${results.photos.length}):\n\n`;

  results.photos.forEach((photo, index) => {
    output += `${index + 1}. ${photo.alt || 'Sem descrição'}\n`;
    output += `   Tamanho: ${photo.width}x${photo.height}\n`;
    output += `   Fotógrafo: ${photo.photographer}\n`;
    output += `   URL: ${photo.src.large2x}\n`;
    output += `   Página: ${photo.url}\n\n`;
  });

  return output;
}

/**
 * Salva imagem para uso no site
 */
async function saveImageForArticle(photo, filename, applyStyle = false) {
  const publicDir = path.join(process.cwd(), 'public', 'images', 'articles');

  // Criar diretório se não existir
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const filepath = path.join(publicDir, filename);
  const tempFilepath = applyStyle ? filepath.replace(/\.jpg$/, '-temp.jpg') : filepath;

  console.log(`📥 Baixando imagem para: ${tempFilepath}`);

  // Baixar imagem em alta qualidade
  await downloadImage(photo.src.large2x, tempFilepath);

  // Aplicar estilo A Cifra se solicitado
  if (applyStyle) {
    try {
      console.log(`🎨 Aplicando estilo A Cifra...`);
      const styleScript = require('./apply-cover-style');
      await styleScript.applyCoverStyle(tempFilepath, filepath);

      // Remover arquivo temporário
      fs.unlinkSync(tempFilepath);
      console.log(`✅ Estilo aplicado com sucesso!`);
    } catch (error) {
      console.warn(`⚠️  Não foi possível aplicar estilo: ${error.message}`);
      console.log(`💡 Instale Sharp: npm install sharp`);
      // Se falhar, usar imagem original
      if (fs.existsSync(tempFilepath)) {
        fs.renameSync(tempFilepath, filepath);
      }
    }
  }

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
📸 Pexels Image Fetcher para A Cifra

Uso:
  node scripts/pexels-image-fetcher.js "termo de busca" [opções]
  node scripts/pexels-image-fetcher.js --category bitcoin [opções]

Opções:
  --save [filename]    Salva a primeira imagem com o nome especificado
  --style              Aplica estilo A Cifra (overlay + vinheta + logo)
  --category [cat]     Usa query pré-definida para categoria
  --count [n]          Número de resultados (padrão: 20)

Exemplos:
  node scripts/pexels-image-fetcher.js "bitcoin cryptocurrency"
  node scripts/pexels-image-fetcher.js --category bitcoin --save bitcoin-cover.jpg --style
  node scripts/pexels-image-fetcher.js "ethereum" --save eth-article.jpg --count 10

Categorias disponíveis:
  ${Object.keys(categoryQueries).join(', ')}

✅ API Key já configurada!
    `);
    process.exit(0);
  }

  // Parse argumentos
  let query = '';
  let saveFilename = null;
  let count = 20;
  let category = null;
  let applyStyle = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--save' && args[i + 1]) {
      saveFilename = args[i + 1];
      i++;
    } else if (args[i] === '--style') {
      applyStyle = true;
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

  try {
    console.log(`🔍 Buscando fotos para: "${query}"\n`);

    const results = await searchPhotos(query, { perPage: count });

    console.log(formatResults(results));

    // Salvar imagem se solicitado
    if (saveFilename && results.photos && results.photos.length > 0) {
      const bestPhoto = results.photos[0]; // Primeira foto (mais relevante)
      const result = await saveImageForArticle(bestPhoto, saveFilename, applyStyle);

      console.log(`\n✅ Imagem salva em: ${result.path}`);
      console.log(`\n📋 Use no frontmatter do artigo:`);
      console.log(`coverImage:`);
      console.log(`  src: '${result.path}'`);
      console.log(`  alt: '${bestPhoto.alt || query}'`);
      console.log(`  width: ${bestPhoto.width}`);
      console.log(`  height: ${bestPhoto.height}`);
      console.log(`\n👤 Créditos (OBRIGATÓRIO):`);
      console.log(`Foto por ${bestPhoto.photographer} no Pexels`);
      console.log(`Link: ${bestPhoto.photographer_url}`);
      console.log(`\n📝 Adicione no final do artigo:`);
      console.log(`*Foto de capa por [${bestPhoto.photographer}](${bestPhoto.photographer_url}) no [Pexels](https://www.pexels.com)*`);
    }

  } catch (error) {
    console.error('❌ Erro ao buscar fotos:', error.message);

    if (error.message.includes('401')) {
      console.log('\n⚠️  Erro de autenticação. Verifique sua API Key.');
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
  categoryQueries
};

