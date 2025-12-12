
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const images = [
    'web3-gaming-cover-fixed.png',
    'crypto-regulation-cover-fixed.png',
    'ai-blockchain-cover-fixed.png'
];

const IMAGES_DIR = path.join(__dirname, '../public/images');

async function convert() {
    for (const imgName of images) {
        const inputPath = path.join(IMAGES_DIR, imgName);
        const outputPath = inputPath.replace('.png', '.webp');

        if (fs.existsSync(inputPath)) {
            try {
                await sharp(inputPath)
                    .webp({ quality: 85 })
                    .toFile(outputPath);
                console.log(`✅ Converted ${imgName} to WebP`);

                // Opcional: remover o png original para evitar duplicidade/confusão
                // fs.unlinkSync(inputPath);
            } catch (e) {
                console.error(`❌ Failed to convert ${imgName}:`, e.message);
            }
        } else {
            console.log(`⚠️ Image not found: ${imgName}`);
        }
    }
}

convert();
