
const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

function getReadingTime(text) {
    const wordsPerMinute = 225;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

function findShortArticles() {
    if (!fs.existsSync(ARTICLES_DIR)) {
        console.log('Directory not found');
        return;
    }

    const files = fs.readdirSync(ARTICLES_DIR);
    const shortArticles = [];

    console.log('Analyzing articles...\n');

    files.forEach(file => {
        if (!file.endsWith('.md')) return;

        const filePath = path.join(ARTICLES_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Remove frontmatter for word count
        const cleanContent = content.replace(/^---[\s\S]*?---/, '');
        const wordCount = cleanContent.split(/\s+/).filter(w => w.length > 0).length;
        const readingTime = Math.ceil(wordCount / 225);

        if (readingTime <= 2) {
            shortArticles.push({
                file,
                wordCount,
                readingTime
            });
        }
    });

    console.log(`Found ${shortArticles.length} articles with 2 minutes or less reading time:\n`);
    shortArticles.forEach(a => {
        console.log(`- ${a.file} (${a.wordCount} words, ~${a.readingTime} min)`);
    });
}

findShortArticles();
