const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');
const pinterestPoster = require('./pinterest-poster.js');

async function testarPinterest() {
    console.log('📌 MODO DE TESTE PINTEREST (FOCADO)');
    console.log('═══════════════════════════════════');

    // Artigo alvo
    const articlePath = "content/articles/400-mil-bitcoins-saram-das-corretoras-desde-o-ano-passado-aponta-santiment.md";
    const absPath = path.resolve(articlePath);

    if (!fs.existsSync(absPath)) {
        console.error('❌ Artigo não encontrado para o teste!');
        return;
    }

    // Preparar dados
    const filename = path.basename(articlePath, '.md');
    const imagePathJPG = path.join(__dirname, '../public/images/articles', `${filename}.jpg`);
    const imagePathPNG = path.join(__dirname, '../public/images/articles', `${filename}.png`);
    const imagePath = fs.existsSync(imagePathJPG) ? imagePathJPG : (fs.existsSync(imagePathPNG) ? imagePathPNG : null);

    if (!imagePath) {
        console.error('❌ Imagem não encontrada para o teste!');
        return;
    }

    const fileContent = fs.readFileSync(absPath, 'utf8');
    const { data, content } = matter(fileContent);

    // Dados para o Post
    const title = data.title || 'Notícia Crypto - A Cifra';
    // Limitar descrição para 490 chars
    const description = (data.excerpt || content.substring(0, 400)).substring(0, 490) + '...';
    const link = `https://a-cifra.com.br/artigo/${filename}`;

    console.log(`\n📋 Dados preparados:`);
    console.log(`   Título: ${title.substring(0, 50)}...`);
    console.log(`   Imagem: ${path.basename(imagePath)}`);
    console.log(`   Link:   ${link}`);

    // Executar
    try {
        await pinterestPoster.postToPinterest(title, description, link, imagePath);
        console.log('\n✅ TESTE PINTEREST CONCLUÍDO!');
    } catch (e) {
        console.error('\n❌ ERRO NO TESTE:', e.message);
    }
}

testarPinterest();
