
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(process.cwd(), 'src/content/articles');
const files = fs.readdirSync(articlesDir);

const jsonFiles = files.filter(f => f.endsWith('.json'));

console.log(`Found ${jsonFiles.length} JSON files to convert.`);

jsonFiles.forEach(file => {
    try {
        const filePath = path.join(articlesDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        // Map categories if needed, but since we updated config, most might direct match.
        // Fallback or explicit mapping can be added here.

        let category = data.category;

        // Prepare frontmatter
        const frontmatter = {
            title: data.title,
            date: data.date,
            category: category,
            excerpt: data.description || data.excerpt, // Handle description vs excerpt
            image: data.coverImage,
            author: data.author || 'Antigravity',
            metaTitle: data.title, // Default to title
            metaDescription: data.description,
            tags: [], // JSON might not have tags, checking..
            coverImage: {
                src: data.coverImage,
                alt: data.title,
                width: 1200,
                height: 630
            }
        };

        if (data.tags) {
            frontmatter.tags = data.tags;
        }

        // Create MD content
        const mdContent = matter.stringify(data.content || '', frontmatter);

        // Write new file
        const newFileName = file.replace('.json', '.md');
        fs.writeFileSync(path.join(articlesDir, newFileName), mdContent);

        console.log(`Converted ${file} to ${newFileName}`);

        // Delete old file
        fs.unlinkSync(filePath);
        console.log(`Deleted ${file}`);

    } catch (e) {
        console.error(`Error converting ${file}:`, e);
    }
});
