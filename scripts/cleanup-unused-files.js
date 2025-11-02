const fs = require('fs');
const path = require('path');

console.log('🧹 Limpando arquivos não utilizados...\n');

// Arquivos de documentação duplicados ou obsoletos na raiz
const rootDocsToDelete = [
    'ATUALIZACAO-CATEGORIAS.md',
    'COMO-ADICIONAR-ARTIGOS.md',
    'ESTRUTURA-PROJETO-COMPLETA.md',
    'FILTROS-BUSCA-IMPLEMENTADOS.md',
    'LEIA.md',
    'LIMPEZA-PROJETO.md',
    'MELHORIAS-IMPLEMENTADAS.md',
    'MIGRACAO-MARKDOWN.md',
];

// Scripts obsoletos
const scriptsToDelete = [
    'scripts/add-incontent-ads.js',
    'scripts/analyze-errors.js',
    'scripts/clean-markdown-spacing.js',
    'scripts/cleanup-large-assets.js',
    'scripts/cleanup-optimize-colors.js',
    'scripts/complete-article-frontmatter.js',
    'scripts/compress-large-assets.js',
    'scripts/convert-html-to-markdown.js',
    'scripts/create-40-articles.js',
    'scripts/create-articles-from-new-images.js',
    'scripts/create-missing-articles.js',
    'scripts/create-new-batch-articles.js',
    'scripts/create-remaining-30-articles.js',
    'scripts/cross-browser-color-test.js',
    'scripts/extract-articles-to-markdown.js',
    'scripts/final-fix-articles.js',
    'scripts/final-optimization.js',
    'scripts/fix-all-frontmatter.js',
    'scripts/fix-article-frontmatter.js',
    'scripts/fix-broken-images.js',
    'scripts/generate-og-image.js',
    'scripts/generate-og-variants.js',
    'scripts/migrate-all-articles.js',
    'scripts/migrate-to-new-articles.js',
    'scripts/monitor-seo.js',
    'scripts/optimize-card-images.js',
    'scripts/optimize-hero.js',
    'scripts/optimize-images.js',
    'scripts/optimize-logo.js',
    'scripts/organize-blog-cards-images.js',
    'scripts/organize-images.ts',
    'scripts/remove-duplicate-articles.js',
    'scripts/remove-large-eps-files.js',
    'scripts/submit-sitemaps.js',
    'scripts/test-mailchimp.js',
    'scripts/test-og-images.js',
    'scripts/test-ux-monetization.js',
    'scripts/unused-images.txt',
    'scripts/update-article-images.ts',
    'scripts/update-image-references.js',
    'scripts/validate-seo.js',
    'scripts/verify-blog-images.js',
];

// Pastas de scripts obsoletas
const scriptFoldersToDelete = [
    'scripts/config',
    'scripts/image-organizer',
    'scripts/main',
    'scripts/modules',
    'scripts/node',
    'scripts/tests',
];

// Arquivos de configuração obsoletos
const configFilesToDelete = [
    'jest.config.js',
    'jest.setup.js',
    'vercel.json',
];

let deletedCount = 0;
let errorCount = 0;

function deleteFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`✅ Deletado: ${filePath}`);
            deletedCount++;
        }
    } catch (error) {
        console.error(`❌ Erro ao deletar ${filePath}:`, error.message);
        errorCount++;
    }
}

function deleteFolder(folderPath) {
    try {
        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true, force: true });
            console.log(`✅ Pasta deletada: ${folderPath}`);
            deletedCount++;
        }
    } catch (error) {
        console.error(`❌ Erro ao deletar pasta ${folderPath}:`, error.message);
        errorCount++;
    }
}

console.log('📄 Deletando documentação obsoleta...');
rootDocsToDelete.forEach(deleteFile);

console.log('\n🔧 Deletando scripts obsoletos...');
scriptsToDelete.forEach(deleteFile);

console.log('\n📁 Deletando pastas de scripts obsoletas...');
scriptFoldersToDelete.forEach(deleteFolder);

console.log('\n⚙️ Deletando arquivos de configuração obsoletos...');
configFilesToDelete.forEach(deleteFile);

console.log('\n' + '='.repeat(50));
console.log(`✅ Arquivos deletados: ${deletedCount}`);
console.log(`❌ Erros: ${errorCount}`);
console.log('='.repeat(50));
console.log('\n✨ Limpeza concluída!');
