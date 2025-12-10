const fs = require('fs');
const path = require('path');

console.log('🔄 Atualizando URLs para a-cifra.pages.dev...\n');

const oldDomain = 'acifra.com';
const newDomain = 'a-cifra.pages.dev';

// Arquivos para atualizar
const filesToUpdate = [
    '.env.example',
    '.env.local',
    'next.config.js',
    'wrangler.toml',
    'README.md',
    'CONFIGURAR_VERCEL_AGORA.md',
    'SUCESSO_API_FUNCIONANDO.md',
    'MISSAO_CUMPRIDA.md',
    'PROXIMOS_PASSOS_EXECUTAR.md',
    'docs/AUTOMACOES_EMAIL_MARKETING.md',
    'docs/COMO_ENVIAR_NEWSLETTER.md',
    'docs/EXEMPLO_PRIMEIRA_NEWSLETTER.md',
    'templates/email-boas-vindas.html',
    'scripts/send-newsletter.js',
];

let updatedCount = 0;
let errorCount = 0;

filesToUpdate.forEach(filePath => {
    try {
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;
            
            // Substituir todas as ocorrências
            content = content.replace(new RegExp(oldDomain, 'g'), newDomain);
            
            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ Atualizado: ${filePath}`);
                updatedCount++;
            } else {
                console.log(`⏭️  Sem alterações: ${filePath}`);
            }
        } else {
            console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ Erro ao atualizar ${filePath}:`, error.message);
        errorCount++;
    }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Arquivos atualizados: ${updatedCount}`);
console.log(`❌ Erros: ${errorCount}`);
console.log('='.repeat(50));
console.log(`\n🌐 Domínio atualizado: ${oldDomain} → ${newDomain}`);
console.log('✨ Atualização concluída!');
