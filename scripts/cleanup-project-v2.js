const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const ARCHIVE_DOCS = path.join(ROOT_DIR, 'docs/archive');
const ARCHIVE_LOGS = path.join(ROOT_DIR, 'logs/archive');
const ARCHIVE_SCRIPTS = path.join(ROOT_DIR, 'scripts/archive');
const ARCHIVE_SCREENSHOTS = path.join(ROOT_DIR, 'logs/archive/screenshots');

// Cria diretórios se não existirem
[ARCHIVE_DOCS, ARCHIVE_LOGS, ARCHIVE_SCRIPTS, ARCHIVE_SCREENSHOTS].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function moveFile(file, destDir) {
    const srcPath = path.join(ROOT_DIR, file);
    const destPath = path.join(destDir, path.basename(file));

    if (fs.existsSync(srcPath)) {
        try {
            fs.renameSync(srcPath, destPath);
            console.log(`✅ Movido: ${file} -> ${path.relative(ROOT_DIR, destPath)}`);
        } catch (e) {
            console.error(`❌ Erro ao mover ${file}: ${e.message}`);
        }
    }
}

function cleanupRoot() {
    console.log('🧹 Limpando RAIZ do projeto...');

    const files = fs.readdirSync(ROOT_DIR);

    files.forEach(file => {
        // Ignorar pastas e configs essenciais
        if (['node_modules', '.git', '.next', 'src', 'public', 'content', 'package.json'].includes(file)) return;

        // 1. Mover Logs e TXT de relatórios
        if (file.endsWith('.log') || file.endsWith('.txt') || file.endsWith('.csv')) {
            if (file !== 'robots.txt') moveFile(file, ARCHIVE_LOGS);
        }

        // 2. Mover Screenshots de Debug
        if (file.startsWith('debug-') || file.startsWith('erro-facebook') || file.endsWith('.png')) {
            // Cuidado para não mover imagens reais se estiverem na raiz (mas não deveriam estar)
            moveFile(file, ARCHIVE_SCREENSHOTS);
        }

        // 3. Mover Documentação/Relatórios MD antigos
        if (file.endsWith('.md') && file !== 'README.md') {
            // Mover arquivos que parecem relatórios (caps lock ou datas)
            if (file.match(/[A-Z0-9_]{5,}\.md/) || file.includes('RELATORIO') || file.includes('PLANO')) {
                moveFile(file, ARCHIVE_DOCS);
            }
        }
    });
}

function cleanupScripts() {
    console.log('\n🧹 Limpando SCRIPTS obsoletos...');
    const SCRIPTS_DIR = path.join(ROOT_DIR, 'scripts');
    const scripts = fs.readdirSync(SCRIPTS_DIR);

    // Scripts que queremos MANTER (Whitelist)
    const KEEP_SCRIPTS = [
        'postar-redes.js',
        'facebook-poster.js',
        'twitter-poster.js',
        'instagram-poster.js',
        'linkedin-poster.js',
        'medium-poster.js',
        'pinterest-poster.js',
        'reddit-poster.js',
        'generate-sitemap.js',
        'gerar-web-stories.js',
        'configurar-bot.js', // Útil para login
        'quick-fix-images.js', // Útil
        'optimize-all-images.js', // Útil (se consertado)
        'cleanup-project-v2.js' // Este script
    ];

    scripts.forEach(file => {
        if (file === 'archive') return;

        // Se não estiver na whitelist, move para archive
        if (!KEEP_SCRIPTS.includes(file)) {
            // Mover teste-* fix-* e outros one-offs
            const src = path.join(SCRIPTS_DIR, file);
            const dest = path.join(ARCHIVE_SCRIPTS, file);

            // Só move se não for diretório
            if (fs.lstatSync(src).isFile()) {
                fs.renameSync(src, dest);
                console.log(`📦 Arquivado Script: ${file}`);
            }
        }
    });
}

cleanupRoot();
cleanupScripts();
console.log('\n✨ Limpeza concluída! Verifique as pastas "archive" se precisar recuperar algo.');
