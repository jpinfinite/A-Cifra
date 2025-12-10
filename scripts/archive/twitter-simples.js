/**
 * TWITTER - MODO SUPER SIMPLES
 * Apenas mostra o tweet para você copiar e colar
 */

const { generateEngagingTweet } = require('./gerar-tweet.js');
const path = require('path');

function showTweet(articlePath) {
    console.log('\n🐦 TWEET PRONTO PARA POSTAR\n');
    console.log('═'.repeat(70));

    // Gerar o tweet
    const tweet = generateEngagingTweet(articlePath);

    console.log('\n📝 COPIE O TWEET ABAIXO:\n');
    console.log('─'.repeat(70));
    console.log(tweet);
    console.log('─'.repeat(70));
    console.log(`\n📊 ${tweet.length}/280 caracteres\n`);

    console.log('✅ INSTRUÇÕES:');
    console.log('   1. Selecione o tweet acima (arraste o mouse)');
    console.log('   2. Copie (Ctrl+C)');
    console.log('   3. Vá para o Twitter (já está aberto)');
    console.log('   4. Clique em "Post" ou "Tweet"');
    console.log('   5. Cole (Ctrl+V)');
    console.log('   6. Clique em "Post"\n');

    console.log('═'.repeat(70));
    console.log('🎯 Tweet pronto! Basta copiar e colar no Twitter!\n');
}

if (require.main === module) {
    const articlePath = process.argv[2] || path.join(__dirname, '../content/articles/400-mil-bitcoins-saram-das-corretoras-desde-o-ano-passado-aponta-santiment.md');
    showTweet(articlePath);
}

module.exports = { showTweet };
