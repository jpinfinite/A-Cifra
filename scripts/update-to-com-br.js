const fs = require('fs');

console.log('🌐 Atualizando URLs para a-cifra.com.br...\n');

const oldDomain = 'a-cifra.pages.dev';
const newDomain = 'a-cifra.com.br';

// Arquivos para atualizar
const filesToUpdate = [
    '.env.example',
    '.env.local',
    'next.config.js',
    'README.md',
    'wrangler.toml',
    'CONFIGURAR_VERCEL_AGORA.md',
    'SUCESSO_API_FUNCIONANDO.md',
    'MISSAO_CUMPRIDA.md',
    'PROXIMOS_PASSOS_EXECUTAR.md',
    'LIMPEZA_E_ATUALIZACAO_CONCLUIDA.md',
    'src/app/privacidade/page.tsx',
    'src/app/contatos/page.tsx',
    'src/app/sobre/page.tsx',
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

console.log('\n' + '='.repeat(60));
console.log(`✅ Arquivos atualizados: ${updatedCount}`);
console.log(`❌ Erros: ${errorCount}`);
console.log('='.repeat(60));
console.log(`\n🌐 Domínio atualizado: ${oldDomain} → ${newDomain}`);
console.log('✨ Atualização concluída!');
console.log('\n📝 Próximos passos:');
console.log('1. Configure o DNS no Registro.br');
console.log('2. Adicione o domínio no Cloudflare Pages');
console.log('3. Aguarde propagação (2-24h)');
console.log('4. Teste: https://a-cifra.com.br');
