/**
 * Script para buscar imagens de múltiplas fontes (Pixabay + Pexels)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const PIXABAY_API_KEY = '23496579-54ca405176c26b14c46e50217';
const PEXELS_API_KEY = '9qRIa6tpUGXqUizPGdA00WPQhBu9eCC8CatJ5JaKmeERm5BjfbaeWJm5';

async function searchPixabay(query) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      key: PIXABAY_API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      min_width: 1200,
      min_height: 630,
      per_page: 20,
      safesearch: 'true'
    });

    https.get(`https://pixabay.com/api/?${params}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.hits && result.hits.length > 0) {
            resolve({
              source: 'Pixabay',
              images: result.hits.map(hit => ({
                url: hit.largeImageURL,
                width: hit.imageWidth,
                height: hit.imageHeight,
                photographer: hit.user
              }))
            });
          } else {
            resolve({ source: 'Pixabay', images: [] });
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function searchPexels(query) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      query: query,
      per_page: 20,
      orientation: 'landscape'
    });

    const options = {
      hostname: 'api.pexels.com',
      path: `/v1/search?${params}`,
      headers: { 'Authorization': PEXELS_API_KEY }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.photos && result.photos.length > 0) {
            resolve({
              source: 'Pexels',
              images: result.photos.map(photo => ({
                url: photo.src.large2x,
                width: photo.width,
                height: photo.height,
                photographer: photo.photographer
              }))
            });
          } else {
            resolve({ source: 'Pexels', images: [] });
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

async function searchMultipleSources(query) {
  console.log(`🔍 Buscando: "${query}"\n`);

  try {
    console.log('📸 Tentando Pixabay...');
    const pixabayResults = await searchPixabay(query);

    if (pixabayResults.images.length > 0) {
      console.log(`✅ ${pixabayResults.images.length} imagens no Pixabay\n`);
      return pixabayResults;
    }

    console.log('⚠️  Tentando Pexels...');
    const pexelsResults = await searchPexels(query);

    if (pexelsResults.images.length > 0) {
      console.log(`✅ ${pexelsResults.images.length} imagens no Pexels\n`);
      return pexelsResults;
    }

    return { source: 'None', images: [] };
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return { source: 'Error', images: [] };
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Uso: node scripts/multi-source-image-fetcher.js "query" "filename"');
    process.exit(1);
  }

  const query = args[0];
  const filename = args[1];
  const outputPath = path.join('public', 'images', `${filename}.jpg`);

  const results = await searchMultipleSources(query);

  if (results.images.length === 0) {
    console.log('❌ Nenhuma imagem encontrada');
    process.exit(1);
  }

  console.log(`📋 Top 3 de ${results.source}:\n`);
  results.images.slice(0, 3).forEach((img, i) => {
    console.log(`${i + 1}. ${img.photographer} - ${img.width}x${img.height}`);
  });

  console.log(`\n⬇️  Baixando de ${results.source}...`);
  await downloadImage(results.images[0].url, outputPath);
  console.log(`✅ Salva: ${outputPath}`);

  console.log(`🎨 Aplicando estilo A Cifra...`);
  const { execSync } = require('child_process');
  try {
    execSync(`node scripts/apply-cover-style.js "${outputPath}"`, { stdio: 'inherit' });
  } catch (e) {
    console.log(`⚠️  Erro ao aplicar estilo`);
  }
}

if (require.main === module) {
  main();
}
