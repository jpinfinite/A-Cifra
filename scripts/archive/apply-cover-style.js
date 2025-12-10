/**
 * Script para aplicar o estilo A Cifra nas imagens de capa
 *
 * Estilo:
 * 1. Overlay dourado #f4af41 com modo "color"
 * 2. Vinheta (bordas escurecidas)
 * 3. Ajuste de contraste e saturaç

 * Uso:
 * node scripts/apply-cover-style.js input.jpg output.jpg
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuração do estilo A Cifra
const STYLE_CONFIG = {
  overlay: {
    color: '#f4af41', // Tom dourado
    opacity: 0.3      // 30% de opacidade
  },
  vignette: {
    strength: 0.5,    // Intensidade do escurecimento das bordas
    radius: 0.7       // Raio da vinheta (0-1)
  },
  adjustments: {
    brightness: 0.95, // Leve escurecimento
    contrast: 1.1,    // Aumenta contraste
    saturation: 1.2   // Aumenta saturação
  }
};

/**
 * Cria SVG de overlay com cor
 */
function createColorOverlay(width, height, color, opacity) {
  return Buffer.from(`
    <svg width="${width}" height="${height}">
      <rect width="${width}" height="${height}" fill="${color}" opacity="${opacity}"/>
    </svg>
  `);
}

/**
 * Cria SVG de vinheta (bordas escurecidas)
 */
function createVignette(width, height, strength, radius) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * radius;

  return Buffer.from(`
    <svg width="${width}" height="${height}">
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="${radius * 100}%">
          <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0" />
          <stop offset="70%" style="stop-color:rgb(0,0,0);stop-opacity:0" />
          <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:${strength}" />
        </radialGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#vignette)"/>
    </svg>
  `);
}

/**
 * Aplica o estilo A Cifra na imagem
 */
async function applyCoverStyle(inputPath, outputPath, options = {}) {
  const config = { ...STYLE_CONFIG, ...options };

  try {
    console.log(`🎨 Processando: ${inputPath}`);

    // Carregar imagem
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    console.log(`📐 Dimensões: ${width}x${height}`);

    // 1. Ajustar brilho, contraste e saturação
    let processed = image
      .modulate({
        brightness: config.adjustments.brightness,
        saturation: config.adjustments.saturation
      })
      .linear(config.adjustments.contrast, -(128 * config.adjustments.contrast) + 128);

    // 2. Aplicar overlay dourado
    const colorOverlay = createColorOverlay(
      width,
      height,
      config.overlay.color,
      config.overlay.opacity
    );

    processed = processed.composite([{
      input: colorOverlay,
      blend: 'multiply' // Simula modo "color" do Photoshop
    }]);

    // 3. Aplicar vinheta (bordas escurecidas)
    const vignette = createVignette(
      width,
      height,
      config.vignette.strength,
      config.vignette.radius
    );

    processed = processed.composite([{
      input: vignette,
      blend: 'over'
    }]);

    // 4. Adicionar logo A Cifra no canto inferior
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logos', 'cifra-positivo.png');

    if (fs.existsSync(logoPath)) {
      console.log(`🏷️  Adicionando logo A Cifra...`);

      // Redimensionar logo para 80px de altura mantendo proporção
      const logoResized = await sharp(logoPath)
        .resize({ height: 80, fit: 'contain' })
        .toBuffer();

      const logoMetadata = await sharp(logoResized).metadata();

      // Posicionar logo no canto inferior esquerdo com margem de 20px
      processed = processed.composite([{
        input: logoResized,
        top: height - logoMetadata.height - 20,
        left: 20,
        blend: 'over'
      }]);
    } else {
      console.warn(`⚠️  Logo não encontrada em: ${logoPath}`);
    }

    // 5. Salvar imagem processada
    await processed
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    console.log(`✅ Imagem salva: ${outputPath}`);

    // Mostrar tamanho do arquivo
    const stats = fs.statSync(outputPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    console.log(`📦 Tamanho: ${fileSizeKB} KB`);

    return outputPath;

  } catch (error) {
    console.error(`❌ Erro ao processar imagem:`, error.message);
    throw error;
  }
}

/**
 * Processa múltiplas imagens
 */
async function processMultipleImages(inputDir, outputDir, options = {}) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file));

  console.log(`📁 Encontradas ${files.length} imagens em ${inputDir}\n`);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '-styled.jpg'));

    await applyCoverStyle(inputPath, outputPath, options);
    console.log('');
  }

  console.log(`✅ Processamento concluído! ${files.length} imagens processadas.`);
}

/**
 * Função principal
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🎨 Apply A Cifra Cover Style

Aplica o estilo característico do A Cifra nas imagens de capa:
- Overlay dourado (#f4af41)
- Bordas escurecidas (vinheta)
- Ajustes de contraste e saturação

Uso:
  node scripts/apply-cover-style.js <input> <output> [opções]
  node scripts/apply-cover-style.js --batch <input-dir> <output-dir>

Exemplos:
  # Processar uma imagem
  node scripts/apply-cover-style.js bitcoin.jpg bitcoin-styled.jpg

  # Processar pasta inteira
  node scripts/apply-cover-style.js --batch public/images/raw public/images/articles

  # Com opções customizadas
  node scripts/apply-cover-style.js input.jpg output.jpg --overlay-opacity 0.4 --vignette 0.6

Opções:
  --overlay-opacity [0-1]    Opacidade do overlay dourado (padrão: 0.3)
  --overlay-color [hex]      Cor do overlay (padrão: #f4af41)
  --vignette [0-1]           Intensidade da vinheta (padrão: 0.5)
  --brightness [0-2]         Ajuste de brilho (padrão: 0.95)
  --contrast [0-2]           Ajuste de contraste (padrão: 1.1)
  --saturation [0-2]         Ajuste de saturação (padrão: 1.2)
  --batch                    Processar pasta inteira

⚠️  Requer Sharp instalado:
  npm install sharp
    `);
    process.exit(0);
  }

  // Parse opções
  const options = {};
  let inputPath, outputPath, batchMode = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--batch') {
      batchMode = true;
    } else if (args[i] === '--overlay-opacity' && args[i + 1]) {
      options.overlay = { ...options.overlay, opacity: parseFloat(args[i + 1]) };
      i++;
    } else if (args[i] === '--overlay-color' && args[i + 1]) {
      options.overlay = { ...options.overlay, color: args[i + 1] };
      i++;
    } else if (args[i] === '--vignette' && args[i + 1]) {
      options.vignette = { ...options.vignette, strength: parseFloat(args[i + 1]) };
      i++;
    } else if (args[i] === '--brightness' && args[i + 1]) {
      options.adjustments = { ...options.adjustments, brightness: parseFloat(args[i + 1]) };
      i++;
    } else if (args[i] === '--contrast' && args[i + 1]) {
      options.adjustments = { ...options.adjustments, contrast: parseFloat(args[i + 1]) };
      i++;
    } else if (args[i] === '--saturation' && args[i + 1]) {
      options.adjustments = { ...options.adjustments, saturation: parseFloat(args[i + 1]) };
      i++;
    } else if (!args[i].startsWith('--')) {
      if (!inputPath) {
        inputPath = args[i];
      } else if (!outputPath) {
        outputPath = args[i];
      }
    }
  }

  if (!inputPath) {
    console.error('❌ Erro: Especifique o arquivo/pasta de entrada');
    process.exit(1);
  }

  try {
    // Verificar se Sharp está instalado
    try {
      require('sharp');
    } catch (error) {
      console.error('❌ Erro: Sharp não está instalado');
      console.log('\n📦 Instale com: npm install sharp');
      process.exit(1);
    }

    if (batchMode) {
      if (!outputPath) {
        console.error('❌ Erro: Especifique a pasta de saída');
        process.exit(1);
      }
      await processMultipleImages(inputPath, outputPath, options);
    } else {
      if (!outputPath) {
        // Gerar nome de saída automaticamente
        const ext = path.extname(inputPath);
        const base = path.basename(inputPath, ext);
        const dir = path.dirname(inputPath);
        outputPath = path.join(dir, `${base}-styled${ext}`);
      }
      await applyCoverStyle(inputPath, outputPath, options);
    }

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
  applyCoverStyle,
  processMultipleImages,
  STYLE_CONFIG
};
