/**
 * GERADOR DE TWEETS OTIMIZADOS
 * Cria tweets engajadores para artigos do A Cifra
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Gera um tweet otimizado para um artigo
 * @param {string} articlePath - Caminho do arquivo markdown
 * @returns {string} Tweet formatado (máx 280 caracteres)
 */
function generateTweet(articlePath) {
    const content = fs.readFileSync(articlePath, 'utf8');
    const { data: frontmatter } = matter(content);

    const title = frontmatter.title;
    const slug = frontmatter.slug;
    const url = `https://a-cifra.com.br/artigo/${slug}`;

    // Extrair hashtags relevantes das tags
    const tags = frontmatter.tags || [];
    const hashtags = tags
        .slice(0, 3) // Máximo 3 hashtags
        .map(tag => {
            // Limpar e formatar hashtag
            const cleaned = tag.replace(/[^a-zA-Z0-9]/g, '');
            return cleaned ? `#${cleaned}` : null;
        })
        .filter(Boolean);

    // Adicionar hashtag principal se não existir
    if (!hashtags.some(h => h.toLowerCase().includes('bitcoin'))) {
        hashtags.unshift('#Bitcoin');
    }

    // Construir o tweet
    let tweet = '';
    const hashtagsStr = hashtags.join(' ');
    const urlLength = 23; // Twitter sempre conta URLs como 23 caracteres
    const maxTitleLength = 280 - hashtagsStr.length - urlLength - 6; // 6 = espaços e quebras

    // Encurtar título se necessário
    let tweetTitle = title;
    if (tweetTitle.length > maxTitleLength) {
        tweetTitle = tweetTitle.substring(0, maxTitleLength - 3) + '...';
    }

    // Formato final
    tweet = `${tweetTitle}\n\n${hashtagsStr}\n\n${url}`;

    // Validar tamanho (Twitter conta diferente, mas vamos garantir)
    if (tweet.length > 280) {
        // Reduzir ainda mais o título
        const reduction = tweet.length - 280 + 10; // margem de segurança
        tweetTitle = title.substring(0, maxTitleLength - reduction - 3) + '...';
        tweet = `${tweetTitle}\n\n${hashtagsStr}\n\n${url}`;
    }

    return tweet;
}

/**
 * Gera tweet com emoji e call-to-action
 * @param {string} articlePath
 * @returns {string}
 */
function generateEngagingTweet(articlePath) {
    const content = fs.readFileSync(articlePath, 'utf8');
    const { data: frontmatter } = matter(content);

    const title = frontmatter.title;
    const slug = frontmatter.slug;
    const category = frontmatter.categorySlug || 'bitcoin';
    const url = `https://a-cifra.com.br/artigo/${slug}`;

    // Emojis por categoria
    const emojiMap = {
        'bitcoin': '₿',
        'ethereum': 'Ξ',
        'defi': '🏦',
        'nft': '🎨',
        'analises': '📊',
        'mercado': '📈',
        'tecnologia': '⚡',
        'regulacao': '⚖️'
    };

    const emoji = emojiMap[category] || '🚀';

    // Hooks de engajamento
    const hooks = [
        '🔥 URGENTE:',
        '⚠️ ATENÇÃO:',
        '💰 DESTAQUE:',
        '📢 NOVIDADE:',
        '🎯 ANÁLISE:',
        '⚡ BREAKING:'
    ];

    // Escolher hook baseado em palavras-chave
    let hook = emoji + ' ';
    if (title.toLowerCase().includes('urgente') || title.toLowerCase().includes('agora')) {
        hook = hooks[0] + ' ';
    } else if (title.toLowerCase().includes('atenção') || title.toLowerCase().includes('cuidado')) {
        hook = hooks[1] + ' ';
    } else if (title.toLowerCase().includes('preço') || title.toLowerCase().includes('valor')) {
        hook = hooks[2] + ' ';
    }

    // Construir tweet engajador
    const urlLength = 23;
    const hookLength = hook.length;
    const hashtagsStr = '#Bitcoin #Crypto';
    const ctaStr = '\n\n📖 Leia mais:';

    const maxTitleLength = 280 - hookLength - hashtagsStr.length - urlLength - ctaStr.length - 4;

    let tweetTitle = title;
    if (tweetTitle.length > maxTitleLength) {
        tweetTitle = tweetTitle.substring(0, maxTitleLength - 3) + '...';
    }

    const tweet = `${hook}${tweetTitle}\n\n${hashtagsStr}${ctaStr}\n${url}`;

    return tweet;
}

/**
 * Gera múltiplas variações de tweet
 * @param {string} articlePath
 * @returns {Array<{style: string, tweet: string}>}
 */
function generateTweetVariations(articlePath) {
    return [
        {
            style: 'simples',
            tweet: generateTweet(articlePath)
        },
        {
            style: 'engajador',
            tweet: generateEngagingTweet(articlePath)
        }
    ];
}

// CLI Usage
if (require.main === module) {
    const articlePath = process.argv[2];

    if (!articlePath) {
        console.error('❌ Uso: node gerar-tweet.js <caminho-do-artigo>');
        console.error('   Exemplo: node gerar-tweet.js ../content/articles/meu-artigo.md');
        process.exit(1);
    }

    if (!fs.existsSync(articlePath)) {
        console.error(`❌ Arquivo não encontrado: ${articlePath}`);
        process.exit(1);
    }

    console.log('\n🐦 GERADOR DE TWEETS - A CIFRA\n');
    console.log('═'.repeat(60));

    const variations = generateTweetVariations(articlePath);

    variations.forEach((v, i) => {
        console.log(`\n📝 Variação ${i + 1}: ${v.style.toUpperCase()}`);
        console.log('─'.repeat(60));
        console.log(v.tweet);
        console.log('─'.repeat(60));
        console.log(`Caracteres: ${v.tweet.length}/280`);
    });

    console.log('\n✅ Tweets gerados com sucesso!\n');
}

module.exports = {
    generateTweet,
    generateEngagingTweet,
    generateTweetVariations
};
