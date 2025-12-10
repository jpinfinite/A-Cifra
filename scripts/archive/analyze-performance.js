#!/usode

/**
 * Performance Analysis Script
 * Analisa bundle size, imagens e performance geral
 * Uso: node scripts/analyze-performance.js
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'out');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function analyzeDirectory(dir) {
  let totalSize = 0;
  let fileCount = 0;
  const files = [];

  function scan(directory) {
    if (!fs.existsSync(directory)) return;

    const items = fs.readdirSync(directory);

    items.forEach(item => {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scan(fullPath);
      } else {
        totalSize += stat.size;
        fileCount++;
        files.push({
          path: fullPath,
          size: stat.size,
          name: path.basename(fullPath)
        });
      }
    });
  }

  scan(dir);
  return { totalSize, fileCount, files };
}

function analyzePerformance() {
  console.log('\n⚡ ANÁLISE DE PERFORMANCE - A CIFRA\n');
  console.log('═'.repeat(60));

  // 1. Análise do Build
  console.log('\n📦 BUILD OUTPUT\n');
  const buildAnalysis = analyzeDirectory(OUT_DIR);
  console.log(`   Total de arquivos: ${buildAnalysis.fileCount}`);
  console.log(`   Tamanho total: ${formatBytes(buildAnalysis.totalSize)}`);

  // 2. Análise de Imagens
  console.log('\n🖼️  IMAGENS\n');
  const imagesAnalysis = analyzeDirectory(IMAGES_DIR);
  console.log(`   Total de imagens: ${imagesAnalysis.fileCount}`);
  console.log(`   Tamanho total: ${formatBytes(imagesAnalysis.totalSize)}`);
  console.log(`   Tamanho médio: ${formatBytes(imagesAnalysis.totalSize / imagesAnalysis.fileCount)}`);

  // 3. Top 10 maiores arquivos
  console.log('\n📊 TOP 10 MAIORES ARQUIVOS\n');
  const allFiles = [...buildAnalysis.files, ...imagesAnalysis.files];
  const topFiles = allFiles.sort((a, b) => b.size - a.size).slice(0, 10);

  topFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file.name} - ${formatBytes(file.size)}`);
  });

  // 4. Análise por tipo
  console.log('\n📁 ANÁLISE POR TIPO DE ARQUIVO\n');
  const byType = {};

  allFiles.forEach(file => {
    const ext = path.extname(file.name).toLowerCase();
    if (!byType[ext]) {
      byType[ext] = { count: 0, size: 0 };
    }
    byType[ext].count++;
    byType[ext].size += file.size;
  });

  Object.entries(byType)
    .sort((a, b) => b[1].size - a[1].size)
    .forEach(([ext, data]) => {
      console.log(`   ${ext || 'sem extensão'}: ${data.count} arquivos - ${formatBytes(data.size)}`);
    });

  // 5. Recomendações
  console.log('\n💡 RECOMENDAÇÕES\n');

  const avgImageSize = imagesAnalysis.totalSize / imagesAnalysis.fileCount;
  if (avgImageSize > 200 * 1024) {
    console.log(`   ⚠️  Tamanho médio de imagem alto (${formatBytes(avgImageSize)})`);
    console.log('      → Recomendação: Otimizar imagens para WebP/AVIF');
  } else {
    console.log('   ✅ Tamanho médio de imagens OK');
  }

  if (buildAnalysis.totalSize > 50 * 1024 * 1024) {
    console.log(`   ⚠️  Build muito grande (${formatBytes(buildAnalysis.totalSize)})`);
    console.log('      → Recomendação: Implementar code splitting');
  } else {
    console.log('   ✅ Tamanho do build OK');
  }

  console.log('\n═'.repeat(60));
  console.log('\n✅ Análise concluída!\n');
}

analyzePerformance();

