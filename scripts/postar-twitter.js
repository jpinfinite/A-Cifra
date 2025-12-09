/**
 * AUTOMAÇÃO COMPLETA: ARTIGO → TWITTER
 * Usa API oficial do Twitter (recomendado) ou fallback para Puppeteer
 */

const fs = require('fs');
const path = require('path');
const { generateEngagingTweet, generateTweet } = require('./gerar-tweet.js');

// Tentar usar API primeiro
let twitterAPI;
try {
    twitterAPI = require('./twitter-api.js');
} catch (e) {
    twitterAPI = null;
}

// Fallback para Puppeteer
let twitterPuppeteer;
try {
    twitterPuppeteer = require('./twitter-poster.js');
} catch (e) {
    twitterPuppeteer = null;
}

/**
 * Posta um artigo no Twitter automaticamente
 * @param {string} articlePath - Caminho do arquivo markdown
 * @param {string} style - 'simples' ou 'engajador'
 */
async function postArticleToTwitter(articlePath, style = 'engajador') {
    console.log('\n🤖 AUTOMAÇÃO TWITTER - A CIFRA');
    console.log('═'.repeat(60));

    // Validar arquivo
    if (!fs.existsSync(articlePath)) {
        console.error(`❌ Arquivo não encontrado: ${articlePath}`);
        return false;
    }

    console.log(`📄 Artigo: ${path.basename(articlePath)}`);

    // Gerar tweet
    console.log(`\n🎨 Gerando tweet (estilo: ${style})...`);
    const tweet = style === 'simples'
        ? generateTweet(articlePath)
        : generateEngagingTweet(articlePath);

    console.log('\n📝 Tweet gerado:');
    console.log('─'.repeat(60));
    console.log(tweet);
    console.log('─'.repeat(60));
    console.log(`Caracteres: ${tweet.length}/280\n`);

    // Verificar se tem credenciais da API
    const hasAPICredentials = process.env.TWITTER_BEARER_TOKEN ||
                             (process.env.TWITTER_API_KEY && process.env.TWITTER_ACCESS_TOKEN);

    if (hasAPICredentials && twitterAPI) {
        console.log('🚀 Usando Twitter API (método recomendado)...\n');
        try {
            const success = await twitterAPI.postTweetWithRetry(tweet);
            if (success) {
                console.log('\n✅ Tweet postado com sucesso via API!');
                return true;
            } else {
                console.log('\n⚠️ Falha na API, tentando método alternativo...');
            }
        } catch (error) {
            console.error('⚠️ Erro na API:', error.message);
            console.log('Tentando método alternativo...');
        }
    } else {
        console.log('ℹ️  Credenciais da API não configuradas');
        console.log('💡 Para automação 100%, configure a API do Twitter');
        console.log('📚 Veja: docs/TWITTER-API-SETUP.md\n');
    }

    // Fallback: Puppeteer
    if (twitterPuppeteer) {
        console.log('🌐 Usando método Puppeteer (navegador)...\n');
        console.log('⏳ Aguardando 3 segundos antes de postar...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        try {
            await twitterPuppeteer.postToTwitter(tweet);
            console.log('\n✅ Processo concluído!');
            return true;
        } catch (error) {
            console.error('❌ Erro no Puppeteer:', error.message);
        }
    }

    // Último recurso: mostrar tweet para copiar
    console.log('\n📋 COPIE E COLE MANUALMENTE:\n');
    console.log('─'.repeat(60));
    console.log(tweet);
    console.log('─'.repeat(60));
    console.log('\n✅ Tweet pronto para postar!');

    return false;
}

/**
 * Posta múltiplos artigos em sequência
 * @param {Array<string>} articlePaths
 * @param {number} delayMinutes - Delay entre posts (em minutos)
 */
async function postMultipleArticles(articlePaths, delayMinutes = 30) {
    console.log(`\n📚 Postando ${articlePaths.length} artigos com intervalo de ${delayMinutes} minutos\n`);

    for (let i = 0; i < articlePaths.length; i++) {
        const articlePath = articlePaths[i];
        console.log(`\n[${i + 1}/${articlePaths.length}] Processando: ${path.basename(articlePath)}`);

        await postArticleToTwitter(articlePath);

        // Aguardar antes do próximo (exceto no último)
        if (i < articlePaths.length - 1) {
            const waitMs = delayMinutes * 60 * 1000;
            console.log(`\n⏰ Aguardando ${delayMinutes} minutos até o próximo post...`);
            await new Promise(resolve => setTimeout(resolve, waitMs));
        }
    }

    console.log('\n🎉 Todos os artigos foram processados!');
}

/**
 * Posta o artigo mais recente da pasta de artigos
 */
async function postLatestArticle() {
    const articlesDir = path.join(__dirname, '../content/articles');
    const files = fs.readdirSync(articlesDir)
        .filter(f => f.endsWith('.md'))
        .map(f => ({
            name: f,
            path: path.join(articlesDir, f),
            time: fs.statSync(path.join(articlesDir, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

    if (files.length === 0) {
        console.error('❌ Nenhum artigo encontrado!');
        return false;
    }

    const latest = files[0];
    console.log(`\n📰 Artigo mais recente: ${latest.name}`);

    return await postArticleToTwitter(latest.path);
}

// CLI Usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];

    if (command === '--latest') {
        // Postar o artigo mais recente
        postLatestArticle();
    } else if (command === '--multiple') {
        // Postar múltiplos artigos
        const articlePaths = args.slice(1);
        if (articlePaths.length === 0) {
            console.error('❌ Uso: node postar-twitter.js --multiple <artigo1> <artigo2> ...');
            process.exit(1);
        }
        postMultipleArticles(articlePaths);
    } else if (command && !command.startsWith('--')) {
        // Postar um artigo específico
        const articlePath = command;
        const style = args[1] || 'engajador';
        postArticleToTwitter(articlePath, style);
    } else {
        console.log(`
🐦 AUTOMAÇÃO TWITTER - A CIFRA

USO:
  node postar-twitter.js <caminho-do-artigo> [estilo]
  node postar-twitter.js --latest
  node postar-twitter.js --multiple <artigo1> <artigo2> ...

EXEMPLOS:
  # Postar artigo específico (estilo engajador)
  node postar-twitter.js content/articles/meu-artigo.md

  # Postar artigo específico (estilo simples)
  node postar-twitter.js content/articles/meu-artigo.md simples

  # Postar o artigo mais recente
  node postar-twitter.js --latest

  # Postar múltiplos artigos com intervalo
  node postar-twitter.js --multiple artigo1.md artigo2.md artigo3.md

ESTILOS:
  - simples: Tweet direto com hashtags das tags do artigo
  - engajador: Tweet com emoji, hook e call-to-action

MÉTODOS:
  1. Twitter API (recomendado) - 100% automatizado
     → Configure: docs/TWITTER-API-SETUP.md

  2. Puppeteer (fallback) - Abre navegador
     → Requer login manual

  3. Manual - Mostra tweet para copiar/colar
        `);
    }
}

module.exports = {
    postArticleToTwitter,
    postMultipleArticles,
    postLatestArticle
};
