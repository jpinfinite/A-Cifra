/**
 * TRADUTOR DE ARTIGOS IA (Llama 3 + Cloudflare)
 * Traduz artigos de português para inglês e espanhol.
 *
 * Uso: node scripts/traduzir-artigos.js
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuração Cloudflare (Mesmos do gerador atual)
const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';
const MODEL = '@cf/meta/llama-3.1-8b-instruct';

// Diretórios
const DIR_PT = path.join(__dirname, '../content/articles');
const DIR_EN = path.join(__dirname, '../content/articles/en');
const DIR_ES = path.join(__dirname, '../content/articles/es');

// Garantir que diretórios existem
if (!fs.existsSync(DIR_EN)) fs.mkdirSync(DIR_EN, { recursive: true });
if (!fs.existsSync(DIR_ES)) fs.mkdirSync(DIR_ES, { recursive: true });

async function translateText(text, targetLang) {
    if (!text) return '';

    const instructions = {
        'en': 'Translate the following text from Portuguese to English. Return ONLY the translated text, without quotes or explanations.',
        'es': 'Traduce el siguiente texto del portugués al español. Devuelve SOLO el texto traducido, sin comillas ni explicaciones.'
    };

    const prompt = `
    ${instructions[targetLang]}

    Text to translate:
    "${text}"
    `;

    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "You are a precise translator. Output only the translated content." },
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 3000
                })
            }
        );

        const json = await response.json();
        if (!json.success) throw new Error(JSON.stringify(json.errors));

        // Limpeza básica
        let result = json.result.response.trim();
        // Remover aspas que a IA às vezes coloca
        if (result.startsWith('"') && result.endsWith('"')) {
            result = result.slice(1, -1);
        }
        return result;
    } catch (e) {
        console.error(`❌ Erro traducao (${targetLang}):`, e.message);
        return null;
    }
}

function generateSlug(title) {
    const slug = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

    // Limitar tamanho do slug para evitar erro ENAMETOOLONG
    return slug.slice(0, 100).replace(/-$/, '');
}

async function processArticle(fileName) {
    if (!fileName.endsWith('.md')) return;

    const filePathPt = path.join(DIR_PT, fileName);
    const fileContent = fs.readFileSync(filePathPt, 'utf8');
    const { data: frontmatterPt, content } = matter(fileContent);

    // Ignorar se já não for idioma principal ou se estiver faltando dados
    if (frontmatterPt.language && frontmatterPt.language !== 'pt-BR') return;

    console.log(`\n📄 Processando: ${frontmatterPt.title}`);

    // Dicionário de slugs para atualizar referências cruzadas
    const slugs = {
        pt: frontmatterPt.slug,
        en: null,
        es: null
    };

    // --- TRADUÇÃO PARA INGLÊS ---
    slugs.en = await handleTranslation(frontmatterPt, content, 'en', DIR_EN);

    // --- TRADUÇÃO PARA ESPANHOL ---
    slugs.es = await handleTranslation(frontmatterPt, content, 'es', DIR_ES);

    // --- ATUALIZAR REFERÊNCIAS CRUZADAS (EM TODOS OS ARQUIVOS) ---
    if (slugs.en && slugs.es) {
        // Atualizar PT
        updateCrossReferences(filePathPt, slugs);

        // Atualizar EN
        if (slugs.en) updateCrossReferences(path.join(DIR_EN, `${slugs.en}.md`), slugs);

        // Atualizar ES
        if (slugs.es) updateCrossReferences(path.join(DIR_ES, `${slugs.es}.md`), slugs);

        console.log('   ✅ Referências cruzadas atualizadas.');
    }
}

async function handleTranslation(sourceFrontmatter, sourceContent, lang, targetDir) {
    // 1. Traduzir metadados básicos para gerar slug e checar existência
    const translatedTitle = await translateText(sourceFrontmatter.title, lang);
    if (!translatedTitle) return sourceFrontmatter.slug; // Fallback

    const newSlug = generateSlug(translatedTitle);
    const targetPath = path.join(targetDir, `${newSlug}.md`);

    if (fs.existsSync(targetPath)) {
        console.log(`   ⚠️  Versão ${lang.toUpperCase()} já existe (${newSlug}), pulando tradução.`);
        return newSlug;
    }

    console.log(`   🌍 Traduzindo para ${lang.toUpperCase()}...`);

    // 2. Traduzir restante
    const translatedExcerpt = await translateText(sourceFrontmatter.excerpt, lang);
    const translatedContent = await translateText(sourceContent, lang);

    // Traduzir metadados SEO
    const translatedMetaTitle = sourceFrontmatter.seo?.metaTitle
        ? await translateText(sourceFrontmatter.seo.metaTitle, lang)
        : translatedTitle;
    const translatedMetaDesc = sourceFrontmatter.seo?.metaDescription
        ? await translateText(sourceFrontmatter.seo.metaDescription, lang)
        : translatedExcerpt;

    if (!translatedContent) {
        console.log(`   ❌ Falha ao traduzir conteúdo para ${lang}.`);
        return null;
    }

    // 3. Montar novo arquivo
    const newFrontmatter = {
        ...sourceFrontmatter,
        title: translatedTitle,
        slug: newSlug,
        excerpt: translatedExcerpt,
        language: lang,
        seo: {
            ...sourceFrontmatter.seo,
            metaTitle: translatedMetaTitle,
            metaDescription: translatedMetaDesc
        },
        // Limpar alternateLanguages temporariamente, será preenchido no final
        alternateLanguages: {}
    };

    const newFileContent = matter.stringify(translatedContent, newFrontmatter);
    fs.writeFileSync(targetPath, newFileContent);
    console.log(`   💾 Salvo: ${lang}/${newSlug}.md`);

    return newSlug;
}

function updateCrossReferences(filePath, slugs) {
    if (!fs.existsSync(filePath)) return;

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(fileContent);

    const currentLang = parsed.data.language || 'pt-BR';

    // Montar objeto alternateLanguages excluindo o próprio idioma
    const alternates = {};
    if (currentLang !== 'pt-BR' && slugs.pt) alternates.pt = slugs.pt;
    if (currentLang !== 'en' && slugs.en) alternates.en = slugs.en;
    if (currentLang !== 'es' && slugs.es) alternates.es = slugs.es;

    parsed.data.alternateLanguages = alternates;

    // Reescrever arquivo preservando conteúdo
    // O gray-matter as vezes mexe na formatação, mas é seguro para markdown padrão
    const newContent = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(filePath, newContent);
}

async function main() {
    console.log('🚀 Iniciando tradutor de artigosIA...');

    const files = fs.readdirSync(DIR_PT).filter(f => f.endsWith('.md'));
    console.log(`📂 Encontrados ${files.length} artigos em português.`);

    for (const file of files) {
        await processArticle(file);
    }

    console.log('\n✨ Tradução em massa concluída!');
}

main();
