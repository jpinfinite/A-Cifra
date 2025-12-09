const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../public/images/articles');
const FILES = [
    'blackrock-ethereum-staking-etf.png',
    'bitcoin-end-of-halving-cycle.png'
];

async function run() {
    for (const file of FILES) {
        const inputPath = path.join(DIR, file);
        if (!fs.existsSync(inputPath)) {
            console.log(`❌ Arquivo não encontrado: ${file}`);
            continue;
        }

        const jpgOutput = inputPath.replace('.png', '.jpg');

        console.log(`🔄 Convertendo ${file}...`);

        try {
            // Converte para JPG (Qualidade 80)
            await sharp(inputPath)
                .jpeg({ quality: 80, mozjpeg: true })
                .toFile(jpgOutput);

            console.log(`✅ Gerado: ${path.basename(jpgOutput)}`);
        } catch (e) {
            console.error(`❌ Erro em ${file}:`, e.message);
        }
    }
}

run();
