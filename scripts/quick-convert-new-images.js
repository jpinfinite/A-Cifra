
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const images = [
    'bitcoin-global-network.png',
    'gamefi-revolucao-jogos.png',
    'ia-blockchain-convergencia-decada.png'
];

const IMAGES_DIR = path.join(__dirname, '../public/images');

async function convert() {
    for (const imgName of images) {
        const inputPath = path.join(IMAGES_DIR, imgName);
        const outputPath = inputPath.replace('.png', '.webp');

        if (fs.existsSync(inputPath)) {
            try {
                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                console.log(`✅ Converted ${imgName} to WebP`);
            } catch (e) {
                console.error(`❌ Failed to convert ${imgName}:`, e.message);
            }
        } else {
            console.log(`⚠️ Image not found: ${imgName}`);
        }
    }
}

convert();
