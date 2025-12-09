/**
 * TESTE RÁPIDO - TWITTER POSTER
 * Script para testar a postagem no Twitter manualmente
 */

const { postArticleToTwitter } = require('./postar-twitter.js');
const path = require('path');

async function testTwitterPost() {
    console.log('\n🧪 TESTE DE POSTAGEM NO TWITTER\n');
    console.log('═'.repeat(60));
    console.log('⚠️  IMPORTANTE:');
    console.log('   1. Feche TODAS as janelas do Chrome');
    console.log('   2. Certifique-se de estar logado no Twitter no Chrome');
    console.log('   3. O script abrirá o Chrome automaticamente');
    console.log('═'.repeat(60));

    // Artigo de teste (o mais recente)
    const articlePath = path.join(__dirname, '../content/articles/400-mil-bitcoins-saram-das-corretoras-desde-o-ano-passado-aponta-santiment.md');

    console.log('\n📄 Artigo de teste:');
    console.log('   400 mil Bitcoins saíram das corretoras...\n');

    console.log('⏳ Iniciando em 5 segundos...');
    console.log('   (Pressione Ctrl+C para cancelar)\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
        await postArticleToTwitter(articlePath, 'engajador');
        console.log('\n✅ Teste concluído com sucesso!');
    } catch (error) {
        console.error('\n❌ Erro durante o teste:', error.message);
        console.error('\nDicas de solução:');
        console.error('   • Feche o Chrome completamente');
        console.error('   • Verifique se está logado no Twitter');
        console.error('   • Tente executar novamente');
    }
}

testTwitterPost();
