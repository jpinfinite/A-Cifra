const path = require('path');
const fs = require('fs');
const facebookPoster = require('./facebook-poster.js');

async function testarFacebook() {
    console.log('📘 MODO DE TESTE FACEBOOK (FOCADO)');
    console.log('══════════════════════════════════');

    // Texto de teste
    const text = "Teste Automático A Cifra: Bitcoin subindo! 🚀 #crypto #bitcoin https://a-cifra.com.br";

    console.log(`\n📋 Dados:`);
    console.log(`   Texto: ${text}`);

    // Executar
    try {
        await facebookPoster.postToFacebook(text);
        console.log('\n✅ TESTE FACEBOOK CONCLUÍDO!');
    } catch (e) {
        console.error('\n❌ ERRO NO TESTE:', e.message);
    }
}

testarFacebook();
