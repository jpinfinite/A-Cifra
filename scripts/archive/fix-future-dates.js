/**
 * Fix Future Dates
 * Ajusta datas futuras para a data atual (ou datas passadas recentes)
 * para evitar que artigos fiquem "agendados" em vez de publicados.
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

// Data de hoje "real" (simulada como 2025-12-08 com base na conversa,
// mas usaremos new Date() do sistema para garantir)
const NOW = new Date();

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function processFile(filename) {
    const filePath = path.join(ARTICLES_DIR, filename);
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex para capturar publishedAt
    const dateRegex = /publishedAt:\s*['"](\d{4}-\d{2}-\d{2})['"]/;
    const match = content.match(dateRegex);

    if (match) {
        const fileDateStr = match[1];
        const fileDate = new Date(fileDateStr);

        // Se a data do arquivo for maior que HOJE (Futuro)
        if (fileDate > NOW) {

            // Opção A: Trazer todos para hoje
            const newDate = formatDate(NOW);

            // Opção B: Voltar no tempo aleatoriamente (para não publicar tudo no mesmo dia)
            // const randomPast = new Date(NOW);
            // randomPast.setDate(NOW.getDate() - Math.floor(Math.random() * 5));
            // const newDate = formatDate(randomPast);

            console.log(`🔧 Corrigindo ${filename}: ${fileDateStr} -> ${newDate}`);

            // Substituir no texto
            content = content.replace(
                `publishedAt: '${fileDateStr}'`,
                `publishedAt: '${newDate}'`
            );

            // Também corrigir updatedAt se necessário
            content = content.replace(
                /updatedAt:\s*['"](\d{4}-\d{2}-\d{2})['"]/,
                `updatedAt: '${newDate}'`
            );

            // Ajustar ID se ele contém a data
            // Ex: id: 'slug-2025-12-10' -> 'slug-2025-12-08'
            // content = content.replace(
            //    fileDateStr,
            //    newDate
            // );

            fs.writeFileSync(filePath, content);
        }
    }
}

function main() {
    console.log('🕰️  Iniciando correção de datas futuras...\n');
    console.log(`📅 Data de Referência (Hoje): ${formatDate(NOW)}`);

    const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));

    files.forEach(file => {
        processFile(file);
    });

    console.log('\n✨ Correção concluída!');
}

main();
