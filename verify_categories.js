
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Hardcoded valid categories from config.ts (since we can't import TS easily in node script without complilation)
const validCategories = [
    'bitcoin', 'altcoins', 'defi', 'nfts', 'analises', 'ethereum', 'seguranca', 'educacao', 'tutoriais', 'memecoin',
    'tecnologia', 'web3', 'regulacao', 'blockchain', 'tendencias', 'curiosidades'
];

// Map names to slug if needed (simple lowercase match is what articleLoader does roughly)
// articleLoader logic:
// cat.name.toLowerCase() === catNameRaw || cat.slug === catNameRaw

const validSet = new Set(validCategories.map(c => c.toLowerCase()));
// Add names too?
// Names:
// Tecnologia, Web3, Regulação, Blockchain, Tendências, Curiosidades
// Bitcoin, Altcoins, DeFi, NFTs, Análises, Ethereum, Segurança, Educação, Tutoriais, Memecoin

const validNames = [
    'Bitcoin', 'Altcoins', 'DeFi', 'NFTs', 'Análises', 'Ethereum', 'Segurança', 'Educação', 'Tutoriais', 'Memecoin',
    'Tecnologia', 'Web3', 'Regulação', 'Blockchain', 'Tendências', 'Curiosidades'
];
validNames.forEach(n => validSet.add(n.toLowerCase()));

const articlesDir = path.join(process.cwd(), 'src/content/articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

console.log('Verifying categories...');

files.forEach(file => {
    const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');
    const { data } = matter(content);
    const cat = data.category;

    if (!cat) {
        console.error(`❌ ${file}: Missing category`);
        return;
    }

    const catLower = cat.toString().toLowerCase();

    // Check if valid
    // articleLoader check:
    // cat.name.toLowerCase() === catNameRaw || cat.slug === catNameRaw || cat.slug.replace('-', '') === catNameRaw.replace(' ', '')

    let isValid = false;
    for (const v of validCategories) {
        if (v === catLower) isValid = true;
    }
    for (const v of validNames) {
         if (v.toLowerCase() === catLower) isValid = true;
    }

    if (isValid) {
        console.log(`✅ ${file}: ${cat}`);
    } else {
         console.error(`❌ ${file}: Invalid category '${cat}'`);
    }
});
