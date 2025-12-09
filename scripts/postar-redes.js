const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { generateEngagingTweet } = require('./gerar-tweet.js');
const twitterPoster = require('./twitter-poster.js');
const facebookPoster = require('./facebook-poster.js');
const instagramPoster = require('./instagram-poster.js');
const redditPoster = require('./reddit-poster.js');
const mediumPoster = require('./medium-poster.js');
const linkedinPoster = require('./linkedin-poster.js');
const pinterestPoster = require('./pinterest-poster.js');
const matter = require('gray-matter');

function nukeChrome() {
    console.log('☢️  Limpando ambiente Chrome...');
    try {
        // Tenta matar graciosamente primeiro
        execSync('taskkill /IM chrome.exe /F', { stdio: 'ignore' });
        // Pausa para o SO liberar os recursos
        const end = Date.now() + 3000;
        while (Date.now() < end) {}
    } catch (e) {}

    const botProfileDir = path.join(os.homedir(), '.chrome-bot-profile');
    const locks = ['SingletonLock', 'SingletonCookie', 'Lockfile'];

    // Tenta apagar locks repetidamente
    for (let i = 0; i < 3; i++) {
        locks.forEach(lock => {
            try {
                const p = path.join(botProfileDir, lock);
                if (fs.existsSync(p)) fs.unlinkSync(p);
            } catch (e) {
                // Se falhar, espera um pouco e tenta de novo
                 const end = Date.now() + 1000;
                 while (Date.now() < end) {}
            }
        });
    }
}

async function broadcastArticle(articlePath) {
    console.log('\n🤖 BROADCAST A CIFRA (Multi-Rede + Pinterest)');
    console.log('═════════════════════════════════════════════');

    if (!fs.existsSync(articlePath)) {
        console.error(`❌ Mídia não encontrada: ${articlePath}`);
        return;
    }

    const filename = path.basename(articlePath, '.md');
    const imagePathJPG = path.join(__dirname, '../public/images/articles', `${filename}.jpg`);
    const imagePathPNG = path.join(__dirname, '../public/images/articles', `${filename}.png`);
    const imagePath = fs.existsSync(imagePathJPG) ? imagePathJPG : (fs.existsSync(imagePathPNG) ? imagePathPNG : null);

    // Dados para Pinterest
    const fileContent = fs.readFileSync(articlePath, 'utf8');
    const { data, content } = matter(fileContent);
    const title = data.title || 'Notícia Crypto';
    const description = data.excerpt || content.substring(0, 200) + '...';
    const link = `https://a-cifra.com.br/artigo/${filename}`;

    const tweetContent = generateEngagingTweet(articlePath);

    // 1. Twitter
    console.log('\n--- TWITTER ---');
    nukeChrome();
    try {
        await twitterPoster.postToTwitter(tweetContent);
        console.log('✅ [Twitter] OK.');
    } catch (e) {
        console.error('❌ [Twitter] Erro:', e.message);
    }

    // 2. Reddit (NOVO - Antes do Pinterest para variar)
    console.log('\n--- REDDIT ---');
    nukeChrome();
    try {
        await redditPoster.postToReddit(title, link);
        console.log('✅ [Reddit] OK.');
    } catch(e) { console.error('❌ [Reddit] Erro:', e.message); }

    // 3. Pinterest (Visual First)
    if (imagePath) {
        console.log('\n--- PINTEREST ---');
        nukeChrome();
        try {
            await pinterestPoster.postToPinterest(title, description, link, imagePath);
            console.log('✅ [Pinterest] OK.');
        } catch (e) {
            console.error('❌ [Pinterest] Erro:', e.message);
        }
    } else {
        console.log('\n⚠️ [Pinterest] Pulado (Sem imagem).');
    }

    // 3. LinkedIn
    console.log('\n--- LINKEDIN ---');
    nukeChrome();
    try {
        await linkedinPoster.postToLinkedIn(tweetContent);
        console.log('✅ [LinkedIn] OK.');
    } catch (e) {
        console.error('❌ [LinkedIn] Erro:', e.message);
    }

    // 4. Medium
    console.log('\n--- MEDIUM ---');
    nukeChrome();
    try {
        await mediumPoster.postToMedium(articlePath);
        console.log('✅ [Medium] OK.');
    } catch (e) {
        console.error('❌ [Medium] Erro:', e.message);
    }

    // 5. Facebook
    console.log('\n--- FACEBOOK ---');
    nukeChrome();
    try {
        await facebookPoster.postToFacebook(link);
        console.log('✅ [Facebook] OK.');
    } catch (e) {
        console.error('❌ [Facebook] Erro:', e.message);
    }

    // 6. Instagram
    if (imagePath) {
        console.log('\n--- INSTAGRAM ---');
        nukeChrome();
        try {
            await instagramPoster.postToInstagram(tweetContent, imagePath);
            console.log('✅ [Instagram] OK.');
        } catch (e) {
            console.error('❌ [Instagram] Erro:', e.message);
        }
    } else {
        console.log('\n⚠️ [Instagram] Pulado (Sem imagem).');
    }

    console.log('\n🎉 BROADCAST FINALIZADO!');
}

if (require.main === module) {
    const target = process.argv[2];
    if (target) broadcastArticle(target);
    else console.log('Uso: node scripts/postar-redes.js <arquivo>');
}

module.exports = { broadcastArticle };
