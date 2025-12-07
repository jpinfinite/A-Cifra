/**
 * CLEANUP DUPLICATES
 * Verifica se existem artigos com títulos muito similares ou iguais e apaga os antigos.
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

function getArticleInfo(filename) {
    const content = fs.readFileSync(path.join(ARTICLES_DIR, filename), 'utf8');
    const titleMatch = content.match(/title:\s*['"](.+)['"]/);
    const dateMatch = content.match(/updatedAt:\s*['"](.+)['"]/);

    // Tentar pegar data de criação do arquivo se não tiver updatedAt
    const stats = fs.statSync(path.join(ARTICLES_DIR, filename));

    return {
        filename,
        title: titleMatch ? titleMatch[1].trim() : null,
        updatedAt: dateMatch ? new Date(dateMatch[1]) : stats.mtime,
        size: stats.size
    };
}

function main() {
    console.log('🧹 Iniciando limpeza de artigos duplicados...\n');

    const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
    const articlesByTitle = {};

    // 1. Agrupar por título
    files.forEach(file => {
        const info = getArticleInfo(file);
        if (!info.title) return;

        // Normalizar título para pegar variações leves
        // Ex: "Bitcoin 2026" vs "Bitcoin 2026: Análise" -> (Isso é perigoso, vamos pelo título exato primeiro)
        const key = info.title.toLowerCase();

        if (!articlesByTitle[key]) {
            articlesByTitle[key] = [];
        }
        articlesByTitle[key].push(info);
    });

    // 2. Verificar duplicados
    let deletedCount = 0;

    Object.keys(articlesByTitle).forEach(title => {
        const group = articlesByTitle[title];

        if (group.length > 1) {
            console.log(`⚠️  Duplicata encontrada: "${title}"`);

            // Ordenar: O mais recente e maior (conteúdo rico) fica em primeiro
            group.sort((a, b) => {
                if (b.updatedAt.getTime() !== a.updatedAt.getTime()) {
                    return b.updatedAt.getTime() - a.updatedAt.getTime(); // Mais recente primeiro
                }
                return b.size - a.size; // Maior primeiro (desempate)
            });

            // O primeiro é o "Keeper" (o que fica). O resto deleta.
            const keeper = group[0];
            const toDelete = group.slice(1);

            console.log(`   ✅ Manter: ${keeper.filename} (${keeper.size} bytes)`);

            toDelete.forEach(item => {
                console.log(`   🗑️  Apagar: ${item.filename} (${item.size} bytes)`);
                fs.unlinkSync(path.join(ARTICLES_DIR, item.filename));
                deletedCount++;
            });
            console.log('');
        }
    });

    if (deletedCount === 0) {
        console.log('✨ Nenhuma duplicata exata encontrada.');
        console.log('   (Talvez os títulos sejam ligeiramente diferentes. Vou checar slugs parecidos...)');

        // Check bônus: Slugs muito parecidos (ex: "bitcoin-2026.md" e "bitcoin-2026-analise.md")
        // Isso requer uma lógica mais agressiva, vamos com calma.
    } else {
        console.log(`🧹 Limpeza concluída! ${deletedCount} arquivos removidos.`);
    }
}

main();
