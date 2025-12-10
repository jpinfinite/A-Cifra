/**
 * Script para comprimir imagens usando TinyPNG API
 * 
 * Uso:
 * 1. Obter API key gratuita em: https://tinypng.com/developers
 * 2. Criar arquivo .env.local com: TINIFY_API_KEY=sua_chave_aqui
 * 3. Executar: node scripts/compress-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Carregar variáveis de ambiente do .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

// Configuração
const API_KEY = process.env.TINIFY_API_KEY || 'YOUR_API_KEY_HERE';
const IMAGES_DIR = path.join(__dirname, '../public/images');
const BACKUP_DIR = path.join(__dirname, '../public/images-backup');

// Extensões suportadas
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// Estatísticas
let stats = {
  total: 0,
  compressed: 0,
  failed: 0,
  savedBytes: 0,
};

/**
 * Comprimir uma imagem usando TinyPNG API
 */
function compressImage(filePath) {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    const originalSize = fileBuffer.length;

    console.log(`📦 Comprimindo: ${fileName} (${formatBytes(originalSize)})`);

    const options = {
      hostname: 'api.tinify.com',
      path: '/shrink',
      method: 'POST',
      auth: `api:${API_KEY}`,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 201) {
        // Sucesso - baixar imagem comprimida
        const outputUrl = res.headers.location;
        
        https.get(outputUrl, (downloadRes) => {
          const chunks = [];
          
          downloadRes.on('data', (chunk) => chunks.push(chunk));
          
          downloadRes.on('end', () => {
            const compressedBuffer = Buffer.concat(chunks);
            const compressedSize = compressedBuffer.length;
            const savedBytes = originalSize - compressedSize;
            const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

            // Salvar imagem comprimida
            fs.writeFileSync(filePath, compressedBuffer);

            console.log(`✅ ${fileName}: ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} (${savedPercent}% menor)`);

            stats.compressed++;
            stats.savedBytes += savedBytes;
            resolve({ success: true, savedBytes });
          });
        }).on('error', reject);
      } else if (res.statusCode === 429) {
        console.log(`⚠️  ${fileName}: Limite de API atingido (500 imagens/mês grátis)`);
        stats.failed++;
        resolve({ success: false, error: 'API limit' });
      } else {
        console.log(`❌ ${fileName}: Erro ${res.statusCode}`);
        stats.failed++;
        resolve({ success: false, error: `HTTP ${res.statusCode}` });
      }
    });

    req.on('error', (error) => {
      console.error(`❌ ${fileName}: ${error.message}`);
      stats.failed++;
      reject(error);
    });

    req.write(fileBuffer);
    req.end();
  });
}

/**
 * Formatar bytes para leitura humana
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Criar backup das imagens originais
 */
function createBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`📁 Backup criado em: ${BACKUP_DIR}`);
  }
}

/**
 * Buscar todas as imagens recursivamente
 */
function findImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findImages(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Processar todas as imagens
 */
async function processImages() {
  console.log('🚀 Iniciando compressão de imagens...\n');

  // Verificar API key
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ Erro: Configure sua API key do TinyPNG!');
    console.log('\n📝 Passos:');
    console.log('1. Obter chave gratuita em: https://tinypng.com/developers');
    console.log('2. Criar arquivo .env.local com: TINIFY_API_KEY=sua_chave_aqui');
    console.log('3. Executar novamente: node scripts/compress-images.js\n');
    process.exit(1);
  }

  // Criar backup
  createBackup();

  // Buscar imagens
  const images = findImages(IMAGES_DIR);
  stats.total = images.length;

  console.log(`📊 Encontradas ${images.length} imagens para comprimir\n`);

  if (images.length === 0) {
    console.log('✅ Nenhuma imagem encontrada para comprimir');
    return;
  }

  // Processar imagens (uma por vez para não sobrecarregar API)
  for (const imagePath of images) {
    try {
      await compressImage(imagePath);
      // Aguardar 1 segundo entre requisições
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Erro ao processar ${path.basename(imagePath)}:`, error.message);
      stats.failed++;
    }
  }

  // Mostrar estatísticas finais
  console.log('\n' + '='.repeat(60));
  console.log('📊 ESTATÍSTICAS FINAIS');
  console.log('='.repeat(60));
  console.log(`Total de imagens: ${stats.total}`);
  console.log(`✅ Comprimidas: ${stats.compressed}`);
  console.log(`❌ Falhas: ${stats.failed}`);
  console.log(`💾 Espaço economizado: ${formatBytes(stats.savedBytes)}`);
  console.log('='.repeat(60) + '\n');

  if (stats.compressed > 0) {
    console.log('✅ Compressão concluída com sucesso!');
    console.log('📁 Backup das originais em: ' + BACKUP_DIR);
  }
}

// Executar
processImages().catch(console.error);
