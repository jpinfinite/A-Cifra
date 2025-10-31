#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// Configurações das variantes
const variants = [
  {
    name: 'dark',
    bgGradient: ['#0f0f23', '#1a1a2e'],
    textColor: '#ffd700',
    accentColor: '#ffed4e'
  },
  {
    name: 'blue',
    bgGradient: ['#1e3a8a', '#3b82f6'],
    textColor: '#ffffff',
    accentColor: '#fbbf24'
  },
  {
    name: 'minimal',
    bgGradient: ['#ffffff', '#f8fafc'],
    textColor: '#1f2937',
    accentColor: '#f59e0b'
  }
];

async function generateOGVariant(variant) {
  try {
    console.log(`🎨 Gerando variante "${variant.name}"...`);
    
    const width = 1200;
    const height = 630;
    
    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${variant.bgGradient[0]};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${variant.bgGradient[1]};stop-opacity:1" />
          </linearGradient>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${variant.textColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${variant.accentColor};stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="url(#bgGradient)"/>
        
        <!-- Decorative elements -->
        <circle cx="100" cy="100" r="40" fill="${variant.accentColor}" opacity="0.1"/>
        <circle cx="1100" cy="530" r="60" fill="${variant.accentColor}" opacity="0.05"/>
        
        <!-- Main Title -->
        <text x="600" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="url(#textGradient)">
          NOT YOUR KEYS
        </text>
        <text x="600" y="260" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="url(#textGradient)">
          NOT YOUR COINS
        </text>
        
        <!-- Subtitle -->
        <text x="600" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="${variant.textColor}" opacity="0.8">
          Por Que a Auto-Custódia É o Único Caminho para a Soberania Financeira
        </text>
        
        <!-- Security Icons -->
        <g transform="translate(400, 400)">
          <!-- Key icon -->
          <circle cx="20" cy="20" r="12" fill="none" stroke="${variant.accentColor}" stroke-width="3"/>
          <line x1="32" y1="20" x2="60" y2="20" stroke="${variant.accentColor}" stroke-width="3"/>
          <line x1="52" y1="12" x2="60" y2="12" stroke="${variant.accentColor}" stroke-width="3"/>
          <line x1="55" y1="28" x2="60" y2="28" stroke="${variant.accentColor}" stroke-width="3"/>
        </g>
        
        <g transform="translate(700, 400)">
          <!-- Shield icon -->
          <path d="M20 8 L35 15 L35 35 Q35 50 20 58 Q5 50 5 35 L5 15 Z" fill="none" stroke="${variant.accentColor}" stroke-width="3"/>
          <path d="M12 28 L18 34 L30 22" fill="none" stroke="${variant.accentColor}" stroke-width="3"/>
        </g>
        
        <!-- Brand -->
        <text x="600" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${variant.accentColor}">
          A CIFRA
        </text>
        <text x="600" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="${variant.textColor}" opacity="0.6">
          Educação Financeira em Criptoativos
        </text>
      </svg>
    `;
    
    const outputPath = path.join(IMAGES_DIR, `og-not-your-keys-${variant.name}.png`);
    
    await sharp(Buffer.from(svgContent))
      .png({ quality: 90 })
      .toFile(outputPath);
    
    const stats = fs.statSync(outputPath);
    const fileSize = (stats.size / 1024).toFixed(1);
    
    console.log(`✅ Variante "${variant.name}" gerada: ${fileSize}KB`);
    
    return outputPath;
    
  } catch (error) {
    console.error(`❌ Erro ao gerar variante "${variant.name}":`, error.message);
    return null;
  }
}

async function generateAllVariants() {
  console.log('🚀 Gerando variantes da imagem OG...\n');
  
  // Verificar se as pastas existem
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
  
  const results = [];
  
  for (const variant of variants) {
    const result = await generateOGVariant(variant);
    if (result) {
      results.push(result);
    }
  }
  
  console.log(`\n📊 RESUMO:`);
  console.log(`   Variantes geradas: ${results.length}`);
  console.log(`   Localização: public/images/`);
  console.log(`\n🎯 Arquivos gerados:`);
  
  results.forEach(filePath => {
    const fileName = path.basename(filePath);
    console.log(`   - ${fileName}`);
  });
  
  console.log(`\n✨ Todas as variantes foram geradas com sucesso!`);
}

// Verificar se sharp está instalado
try {
  require('sharp');
  generateAllVariants();
} catch (error) {
  console.log('📦 Sharp não encontrado. Instalando...');
  console.log('Execute: npm install sharp --save-dev');
  console.log('Depois execute novamente: node scripts/generate-og-variants.js');
}