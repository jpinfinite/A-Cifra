
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

// Função para listar arquivos recursivamente (incluindo subdiretórios en/es)
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function detectLanguage(filePath) {
  if (filePath.includes(path.sep + 'en' + path.sep)) return 'English';
  if (filePath.includes(path.sep + 'es' + path.sep)) return 'Spanish';
  if (filePath.endsWith('.en.md')) return 'English';
  if (filePath.endsWith('.es.md')) return 'Spanish';
  return 'Portuguese'; // Default
}

async function generateMetaDescription(title, content, language) {
  const prompt = `
Generate a compelling SEO meta description for this article.
Article Language: ${language} (OUTPUT MUST BE IN ${language.toUpperCase()})
Title: "${title}"
Content Start: "${content.substring(0, 500)}..."

Requirements:
- Length: 130-155 characters.
- Must include main keyword from title.
- Call to action at the end (e.g. "Read more!", "iLee mas!", "Leia mais!").
- Language: STRICTLY ${language}. Do NOT translate to Portuguese if the article is in English/Spanish.
- Output: ONLY the description text, nothing else.
`;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `You are an SEO expert. You speak ${language} fluently. Output only the meta description in ${language}.` },
            { role: "user", content: prompt }
          ]
        })
      }
    );

    const result = await response.json();
    return result.result.response.trim();
  } catch (error) {
    console.error(`Erro AI: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🔧 AUTO SEO FIXER: Corrigindo Meta Titles e Descriptions...\n');

  const files = getAllFiles(ARTICLES_DIR);
  let processed = 0;
  let fixed = 0;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    let modified = false;

    const language = detectLanguage(filePath); // Detectar idioma

    // 1. Fix Meta Title
    if (!parsed.data.title) {
        console.warn(`⚠️ [SKIP] Sem título: ${path.basename(filePath)}`);
        continue;
    }

    if (!parsed.data.metaTitle) {
      parsed.data.metaTitle = parsed.data.title.substring(0, 60);
      modified = true;
      console.log(`✅ [TITLE] ${path.basename(filePath)}`);
    } else if (parsed.data.metaTitle.length > 65) {
       parsed.data.metaTitle = parsed.data.metaTitle.substring(0, 60) + '...';
       modified = true;
       console.log(`✂️ [TITLE TRUNCATED] ${path.basename(filePath)}`);
    }

    // 2. Fix Meta Description
    if (!parsed.data.metaDescription || parsed.data.metaDescription.length < 50) {
      console.log(`🤖 [DESC GENERATING - ${language}] ${path.basename(filePath)}`);

      const newDesc = await generateMetaDescription(parsed.data.title, parsed.content, language);

      if (newDesc) {
        parsed.data.metaDescription = newDesc.replace(/"/g, ''); // Remove aspas extras
        modified = true;
        console.log(`   -> "${newDesc}"`);
      }

      await new Promise(r => setTimeout(r, 1500));
    }

    if (modified) {
      const newContent = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(filePath, newContent);
      fixed++;
    }
    processed++;
  }

  console.log(`\n🎉 Concluído! Processados: ${processed}, Corrigidos: ${fixed}`);
}

main();
