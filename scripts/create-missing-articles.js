const fs = require('fs');
const path = require('path');

// Imagens que já têm artigos (baseado no articlesConfig.ts)
const usedImages = [
  'bitcoin-guide.jpg',
  'digital-wallet-security.jpg',
  'crypto-trading-setup.jpg',
  'bitcoin-global-network.jpg',
  'defi1.jpg',
  'crypto-trading-desk.jpg',
  'gamefi-revolucao-jogos.webp',
  'dblok.jpg',
  'pools-liquidez-defi.webp',
  'blockchain-technology.jpg',
  'solana-etf-ascensao.webp',
  'crypto-futuristic-scene.jpg',
  'crypto-market-analysis.jpg',
  'crypto-exchange.jpg',
  'altcoins-2025.jpg',
  'memecoins-phenomenon.jpg',
  'metamask-wallet.jpg',
  'crypto-analysis-charts.jpg',
  'defi-revolution.jpg',
  'etherum-2.0.jpg',
  'Layer2.jpg',
  'staking-recompensas.jpg',
  'block.webp',
  'criptomoedas-geral.jpg',
  'criptoativos.jpg',
  'carteira.jpg',
  'minero.jpg',
  'shiba.jpg',
  'doge.jpg',
  'memecoins.jpg',
  'floki.jpg',
  'pepe.jpg',
  'bit.jpg',
  'uniswap.jpg',
  'nft.jpg',
  'PancakeSwap.jpg',
  'yield.jpg',
  'perda.jpg',
  'curve.jpg',
  'comp.jpg',
  'dao.jpg',
  'AaveV3.jpg'
];

// Ler todas as imagens do diretório
const imagesDir = path.join(__dirname, '../public/images');
const allImages = fs.readdirSync(imagesDir)
  .filter(file => file.match(/\.(jpg|jpeg|png|webp)$/i));

// Encontrar imagens sem artigos
const unusedImages = allImages.filter(img => !usedImages.includes(img));

console.log(`Total de imagens: ${allImages.length}`);
console.log(`Imagens com artigos: ${usedImages.length}`);
console.log(`Imagens sem artigos: ${unusedImages.length}\n`);

console.log('Imagens sem artigos:');
unusedImages.forEach((img, index) => {
  console.log(`${index + 1}. ${img}`);
});

// Salvar lista em arquivo
fs.writeFileSync(
  path.join(__dirname, 'unused-images.txt'),
  unusedImages.join('\n')
);

console.log('\n✅ Lista salva em scripts/unused-images.txt');
