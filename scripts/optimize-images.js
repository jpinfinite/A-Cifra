#!/usr/bin/env node

/**
 * Script de Otimização de Imagens
 *
 * Otimiza todas as imagens do site para melhor performance
 * - Redimensiona para tamanhos adequados
 * - Converte para WebP
 * - Comprime sem perda significativa de qualidade
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'articles');
const OPTIMIZED_SUFFIX = '_optimized';

// Configurações de otimização
const OPTIMIZATION_CONFIG = {
  // Imagens de capa de artigos
  cover: {
    width: 1200,
    height: 630,
    quality: 85,
    format: 'webp'
  },
  // Imagens dentro de artigos
  content: {
    width: 800,
    quality: 80,
    format: 'webp'
  }
};

/**
 * Otimiza uma imagem
 */
async function optimizeImage(inputPath, outputPath, config) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`📸 Otimizando: ${path.basename(inputPath)}`);
    console.log(`   Original: ${metadata.width}x${metadata.height} (${(metadata.size / 1024).toFixed(2)} KB)`);

    let pipeline = image;

    // Redimensionar se necessário
    if (config.width || config.height) {
      pipeline = pipeline.resize(config.width, config.height, {
        fit: 'cover',
        position: 'center'
      });
    }

    // Converter para WebP com qualidade especificada
    if (config.format === 'webp') {
      pipeline = pipeline.webp({ quality: config.quality });
    } else if (config.format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality: config.quality, progressive: true });
    } else if (config.format === 'png') {
      pipeline = pipeline.png({ quality: config.quality, compressionLevel: 9 });
    }

    // Salvar
    await pipeline.toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const savings = ((1 - outputStats.size / metadata.size) * 100).toFixed(2);

    console.log(`   Otimizado: ${config.width || metadata.width}x${config.height || metadata.height} (${(outputStats.size / 1024).toFixed(2)} KB)`);
    console.log(`   ✅ Economia: ${savings}%\n`);

    return {
      original: metadata.size,
      optimized: outputStats.size,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`   ❌ Erro ao otimizar ${path.basename(inputPath)}:`, error.message);
    return null;
  }
}

/**
 * Otimiza todas as imagens de capa
 */
async function optimizeCoverImages() {
  console.log('🎨 Otimizando imagens de capa dos artigos...\n');

  const coverImages = [
    'rwa-tokenization-cover.png',
    'defi-guide-cover.png',
    'layer2-ethereum-cover.png'
  ];

  const results = [];

  for (const imageName of coverImages) {
    const inputPath = path.join(IMAGES_DIR, imageName);
    const outputName = imageName.replace(/\.(png|jpg|jpeg)$/, '.webp');
    const outputPath = path.join(IMAGES_DIR, outputName);

    if (fs.existsSync(inputPath)) {
      const result = await optimizeImage(inputPath, outputPath, OPTIMIZATION_CONFIG.cover);
      if (result) {
        results.push(result);
      }
    } else {
      console.log(`⚠️  Imagem não encontrada: ${imageName}\n`);
    }
  }

  return results;
}

/**
 * Otimiza todas as outras imagens
 */
async function optimizeAllImages() {
  console.log('🖼️  Otimizando outras imagens...\n');

  const files = fs.readdirSync(IMAGES_DIR);
  const imageFiles = files.filter(file =>
    /\.(png|jpg|jpeg)$/i.test(file) &&
    !file.includes('_optimized') &&
    !file.includes('.webp') &&
    !['rwa-tokenization-cover.png', 'defi-guide-cover.png', 'layer2-ethereum-cover.png'].includes(file)
  );

  const results = [];

  for (const imageName of imageFiles) {
    const inputPath = path.join(IMAGES_DIR, imageName);
    const outputName = imageName.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const outputPath = path.join(IMAGES_DIR, outputName);

    // Pular se já existe versão WebP
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Pulando ${imageName} (WebP já existe)\n`);
      continue;
    }

    const result = await optimizeImage(inputPath, outputPath, OPTIMIZATION_CONFIG.content);
    if (result) {
      results.push(result);
    }
  }

  return results;
}

/**
 * Exibe resumo das otimizações
 */
function showSummary(results) {
  if (results.length === 0) {
    console.log('ℹ️  Nenhuma imagem foi otimizada.\n');
    return;
  }

  const totalOriginal = results.reduce((sum, r) => sum + r.original, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.optimized, 0);
  const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(2);

  console.log('📊 RESUMO DA OTIMIZAÇÃO\n');
  console.log(`   Imagens otimizadas: ${results.length}`);
  console.log(`   Tamanho original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Tamanho otimizado: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   ✅ Economia total: ${totalSavings}% (${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)} MB)\n`);
}

/**
 * Executa otimização
 */
async function run() {
  console.log('🚀 Iniciando otimização de imagens...\n');

  try {
    // Otimizar imagens de capa
    const coverResults = await optimizeCoverImages();

    // Otimizar outras imagens
    const otherResults = await optimizeAllImages();

    // Mostrar resumo
    const allResults = [...coverResults, ...otherResults];
    showSummary(allResults);

    console.log('✅ Otimização concluída!\n');
  } catch (error) {
    console.error('❌ Erro durante otimização:', error);
    process.exit(1);
  }
}

// Executar
run();
