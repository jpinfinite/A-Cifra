const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  {
    src: 'C:/Users/jpdes/.gemini/antigravity/brain/86b85c9f-a633-4fde-8b4b-5026c5114065/desci_decentralized_science_concept_1765814179170.png',
    slug: 'desci-ciencia-descentralizada'
  },
  {
    src: 'C:/Users/jpdes/.gemini/antigravity/brain/86b85c9f-a633-4fde-8b4b-5026c5114065/bitcoin_layer2_scaling_concept_1765814364744.png',
    slug: 'bitcoin-layer-2-escalabilidade'
  },
  {
    src: 'C:/Users/jpdes/.gemini/antigravity/brain/86b85c9f-a633-4fde-8b4b-5026c5114065/account_abstraction_ux_concept_1765814551488.png',
    slug: 'abstracao-conta-fim-senhas'
  },
  {
    src: 'C:/Users/jpdes/.gemini/antigravity/brain/86b85c9f-a633-4fde-8b4b-5026c5114065/cross_chain_gaming_metaverse_1765814688920.png',
    slug: 'games-interoperaveis-metaverso'
  },
  {
    src: 'C:/Users/jpdes/.gemini/antigravity/brain/86b85c9f-a633-4fde-8b4b-5026c5114065/green_bitcoin_mining_renewable_1765814829676.png',
    slug: 'mineracao-bitcoin-verde-sustentavel'
  }
];

const destDir = path.join(process.cwd(), 'public/images/articles');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function processImages() {
  for (const img of images) {
    const destPath = path.join(destDir, `${img.slug}.webp`);
    try {
      if (fs.existsSync(img.src)) {
        await sharp(img.src)
          .webp({ quality: 85 })
          .toFile(destPath);
        console.log(`✅ Converted ${img.slug}`);
      } else {
        console.error(`❌ Source missing: ${img.src}`);
      }
    } catch (err) {
      console.error(`Error processing ${img.slug}:`, err);
    }
  }
}

processImages();
