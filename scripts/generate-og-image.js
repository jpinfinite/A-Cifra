#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

async function generateOGImage() {
  try {
    console.log('🎨 Gerando imagem OG para "NOT YOUR KEYS, NOT YOUR COINS"...\n');
    
    // Dimensões padrão para OG images (1200x630)
    const width = 1200;
    const height = 630;
    
    // Criar SVG com o design da imagem OG
    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffed4e;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="url(#bgGradient)"/>
        
        <!-- Logo A Cifra (usando o ícone principal) -->
        <circle cx="150" cy="150" r="60" fill="#ffd700" opacity="0.1"/>
        <text x="150" y="165" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#ffd700">₿</text>
        
        <!-- Título Principal -->
        <text x="600" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="url(#textGradient)">
          NOT YOUR KEYS
        </text>
        <text x="600" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="url(#textGradient)">
          NOT YOUR COINS
        </text>
        
        <!-- Subtítulo -->
        <text x="600" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" opacity="0.9">
          Por Que a Auto-Custódia É o Único Caminho
        </text>
        <text x="600" y="390" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" opacity="0.9">
          para a Soberania Financeira em Criptoativos
        </text>
        
        <!-- Ícones de segurança -->
        <g transform="translate(200, 450)">
          <!-- Cadeado -->
          <rect x="0" y="15" width="30" height="25" rx="3" fill="none" stroke="#ffd700" stroke-width="2"/>
          <path d="M5 15 L5 10 Q5 5 15 5 Q25 5 25 10 L25 15" fill="none" stroke="#ffd700" stroke-width="2"/>
          <circle cx="15" cy="27" r="3" fill="#ffd700"/>
        </g>
        
        <g transform="translate(400, 450)">
          <!-- Chave -->
          <circle cx="8" cy="20" r="8" fill="none" stroke="#ffd700" stroke-width="2"/>
          <line x1="16" y1="20" x2="35" y2="20" stroke="#ffd700" stroke-width="2"/>
          <line x1="30" y1="15" x2="35" y2="15" stroke="#ffd700" stroke-width="2"/>
          <line x1="32" y1="25" x2="35" y2="25" stroke="#ffd700" stroke-width="2"/>
        </g>
        
        <g transform="translate(800, 450)">
          <!-- Escudo -->
          <path d="M15 5 L25 10 L25 25 Q25 35 15 40 Q5 35 5 25 L5 10 Z" fill="none" stroke="#ffd700" stroke-width="2"/>
          <path d="M10 20 L14 24 L22 16" fill="none" stroke="#ffd700" stroke-width="2"/>
        </g>
        
        <!-- Brand -->
        <text x="600" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffd700">
          A CIFRA
        </text>
        <text x="600" y="580" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" opacity="0.7">
          blog-a-cifra.pages.dev
        </text>
      </svg>
    `;
    
    // Gerar a imagem PNG usando Sharp
    const outputPath = path.join(IMAGES_DIR, 'og-not-your-keys-not-your-coins.png');
    
    await sharp(Buffer.from(svgContent))
      .png({ quality: 90 })
      .toFile(outputPath);
    
    const stats = fs.statSync(outputPath);
    const fileSize = (stats.size / 1024).toFixed(1);
    
    console.log(`✅ Imagem OG gerada com sucesso!`);
    console.log(`📁 Local: ${path.relative(process.cwd(), outputPath)}`);
    console.log(`📏 Dimensões: ${width}x${height}px`);
    console.log(`📦 Tamanho: ${fileSize}KB`);
    console.log(`🔗 URL: /images/og-not-your-keys-not-your-coins.png\n`);
    
    console.log('🎯 Para usar no artigo, adicione esta linha no markdown:');
    console.log('![NOT YOUR KEYS, NOT YOUR COINS - OG Image](/images/og-not-your-keys-not-your-coins.png)');
    
  } catch (error) {
    console.error('❌ Erro ao gerar imagem OG:', error.message);
    process.exit(1);
  }
}

// Verificar se as pastas existem
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Verificar se sharp está instalado
try {
  require('sharp');
  generateOGImage();
} catch (error) {
  console.log('📦 Sharp não encontrado. Instalando...');
  console.log('Execute: npm install sharp --save-dev');
  console.log('Depois execute novamente: node scripts/generate-og-image.js');
}