const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const sharp = require('sharp');

const CONTENT_DIRS = [
  path.join(process.cwd(), 'content/articles'),
  path.join(process.cwd(), 'content/articles/en'),
  path.join(process.cwd(), 'content/articles/es')
];
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const TARGET_IMG_DIR = path.join(PUBLIC_DIR, 'images/articles');

// Ensure target dir matches what we want
if (!fs.existsSync(TARGET_IMG_DIR)) {
  fs.mkdirSync(TARGET_IMG_DIR, { recursive: true });
}

async function processFile(filePath) {
    // Read file
    let fileContent;
    try {
        fileContent = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
        return;
    }

    const parsed = matter(fileContent);
    const { data, content } = parsed;
    const slug = path.basename(filePath, '.md');

    // Normalize coverImage structure
    let oldSrc = '';
    if (typeof data.coverImage === 'string') {
        oldSrc = data.coverImage;
        data.coverImage = { src: oldSrc, alt: data.title || slug };
    } else if (data.coverImage && data.coverImage.src) {
        oldSrc = data.coverImage.src;
    } else if (data.image) { // Fallback to 'image' field if coverImage missing
         oldSrc = data.image;
         if (!data.coverImage) data.coverImage = {};
         data.coverImage.src = oldSrc;
         delete data.image; // Clean up
    }

    if (!oldSrc) {
        console.warn(`No cover image for ${slug}`);
        return;
    }

    // Resolve source path
    let sourcePath = '';
    // Handle query params in oldSrc (e.g. ?v=1)
    const cleanOldSrc = oldSrc.split('?')[0];

    if (cleanOldSrc.startsWith('http')) {
        if (cleanOldSrc.includes('a-cifra.com.br/images/')) {
             const relative = cleanOldSrc.split('a-cifra.com.br')[1];
             sourcePath = path.join(PUBLIC_DIR, relative);
        } else {
            console.warn(`External image ${cleanOldSrc} for ${slug} - Skipping`);
            return;
        }
    } else if (cleanOldSrc.startsWith('/')) {
        sourcePath = path.join(PUBLIC_DIR, cleanOldSrc);
    } else {
        // Relative to ??? Assume public/images
        sourcePath = path.join(PUBLIC_DIR, 'images', cleanOldSrc);
    }

    // Decode URL entities if any
    sourcePath = decodeURIComponent(sourcePath);

    if (!fs.existsSync(sourcePath)) {
        // Try finding it directly in public/images if path was weird
        const filename = path.basename(cleanOldSrc);
        const fuzzyPath = path.join(PUBLIC_DIR, 'images', filename);
        if (fs.existsSync(fuzzyPath)) {
             sourcePath = fuzzyPath;
        } else {
             // Try in public/images/articles
             const fuzzyPath2 = path.join(PUBLIC_DIR, 'images/articles', filename);
             if (fs.existsSync(fuzzyPath2)) {
                 sourcePath = fuzzyPath2;
             } else {
                 console.error(`Image not found: ${sourcePath} (mapped from ${oldSrc}) for ${slug}`);
                 return;
             }
        }
    }

    const newFilename = `${slug}.webp`;
    const newDestPath = path.join(TARGET_IMG_DIR, newFilename);
    const newPublicPath = `/images/articles/${newFilename}`;

    // Optimization: Skip valid files if they already point to the correct place AND file exists
    if (data.coverImage.src === newPublicPath && fs.existsSync(newDestPath)) {
        // Ensure alt is present
        if (!data.coverImage.alt) {
             data.coverImage.alt = data.title || slug;
             // Save changes just for alt
        } else {
             return; // All good
        }
    }

    // Convert/Copy
    try {
        // Don't overwrite if it's the SAME file (src == dest)
        if (path.resolve(sourcePath) !== path.resolve(newDestPath)) {
             await sharp(sourcePath)
                .webp({ quality: 80 })
                .toFile(newDestPath);
        } else {
             // If source IS dest (already in place), just ensure it is webp?
             // If it is already webp, we are good.
        }

        // Update frontmatter
        data.coverImage.src = newPublicPath;
        if (!data.coverImage.alt) {
            data.coverImage.alt = data.title || slug;
        }

        // Write back
        const newContent = matter.stringify(content, data);
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${slug}`);
    } catch (err) {
        console.error(`Error processing ${slug}:`, err);
    }
}

async function main() {
    for (const dir of CONTENT_DIRS) {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
            console.log(`Processing ${files.length} files in ${dir}...`);
            for (const file of files) {
                await processFile(path.join(dir, file));
            }
        } else {
            console.log(`Skipping missing dir: ${dir}`);
        }
    }
}

main();
