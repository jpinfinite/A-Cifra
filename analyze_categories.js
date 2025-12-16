
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(process.cwd(), 'src/content/articles');
const files = fs.readdirSync(articlesDir);

const categories = {};

files.forEach(file => {
    const filePath = path.join(articlesDir, file);
    let category = 'UNKNOWN';

    try {
        if (file.endsWith('.md')) {
            const content = fs.readFileSync(filePath, 'utf8');
            const parsed = matter(content);
            category = parsed.data.category || 'MISSING';
        } else if (file.endsWith('.json')) {
            const content = fs.readFileSync(filePath, 'utf8');
            const parsed = JSON.parse(content);
            category = parsed.category || 'MISSING';
        } else {
            return;
        }
    } catch (e) {
        console.error(`Error parsing ${file}:`, e.message);
    }

    if (!categories[category]) {
        categories[category] = [];
    }
    categories[category].push(file);
});

console.log('Categories found in content:');
Object.keys(categories).forEach(cat => {
    console.log(`- "${cat}": ${categories[cat].length} files`);
    // console.log(`  Files: ${categories[cat].join(', ')}`);
});
