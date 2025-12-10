/**
 * Gerador de Newsletter Semanal
 * Compila artigos da semana em HTML para newsletter
 * Execute: node scripts/gerar-newsletter.js
 */

const fs = require('fs');
const path = require('path');

function getArticlesFromLastWeek() {
  const articlesDir = path.join(__dirname, '../content/articles');
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

  const articles = files.map(file => {
    const filePath = path.join(articlesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    const titleMatch = content.match(/title:\s*['"](.+)['"]/);
    const excerptMatch = content.match(/excerpt:\s*['"](.+)['"]/);
    const slugMatch = content.match(/slug:\s*['"](.+)['"]/);
    const dateMatch = content.match(/publishedAt:\s*['"](.+)['"]/);
    const categoryMatch = content.match(/categorySlug:\s*['"](.+)['"]/);

    return {
      title: titleMatch ? titleMatch[1] : '',
      excerpt: excerptMatch ? excerptMatch[1] : '',
      slug: slugMatch ? slugMatch[1] : '',
      publishedAt: dateMatch ? new Date(dateMatch[1]) : new Date(0),
      category: categoryMatch ? categoryMatch[1] : 'geral',
      url: `https://a-cifra.com.br/artigo/${slugMatch ? slugMatch[1] : ''}`
    };
  }).filter(article => article.publishedAt >= oneWeekAgo);

  return articles.sort((a, b) => b.publishedAt - a.publishedAt);
}

function generateNewsletterHTML(articles) {
  const categoryNames = {
    bitcoin: '₿ Bitcoin',
    ethereum: 'Ξ Ethereum',
    defi: '🏦 DeFi',
    nfts: '🎨 NFTs',
    regulacao: '⚖️ Regulação',
    educacao: '📚 Educação',
    seguranca: '🔐 Segurança',
    analises: '📊 Análises',
    altcoins: '🚀 Altcoins'
  };

  const articlesByCategory = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {});

  let sectionsHTML = '';

  for (const [category, categoryArticles] of Object.entries(articlesByCategory)) {
    sectionsHTML += `
      <div class="category-section">
        <h2>${categoryNames[category] || category}</h2>
        ${categoryArticles.map(article => `
          <div class="article-card">
            <h3><a href="${article.url}">${article.title}</a></h3>
            <p>${article.excerpt}</p>
            <a href="${article.url}" class="read-more">Ler artigo completo →</a>
          </div>
        `).join('')}
      </div>
    `;
  }

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter Semanal - A Cifra</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      background: white;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .category-section {
      margin-bottom: 30px;
    }
    .category-section h2 {
      color: #667eea;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
    }
    .article-card {
      margin: 20px 0;
      padding: 15px;
      border-left: 3px solid #764ba2;
      background: #f9f9f9;
    }
    .article-card h3 {
      margin-top: 0;
      font-size: 18px;
    }
    .article-card a {
      color: #667eea;
      text-decoration: none;
    }
    .article-card a:hover {
      text-decoration: underline;
    }
    .read-more {
      display: inline-block;
      margin-top: 10px;
      color: #764ba2;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 14px;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📰 A Cifra Newsletter</h1>
    <p>Resumo semanal dos melhores artigos sobre criptomoedas</p>
  </div>

  <div class="content">
    <p>Olá! 👋</p>
    <p>Aqui estão os <strong>${articles.length} artigos</strong> que publicamos esta semana:</p>

    ${sectionsHTML}

    <div style="margin-top: 40px; padding: 20px; background: #f0f0f0; border-radius: 10px;">
      <h3>💡 Dica da Semana</h3>
      <p>Nunca deixe grandes quantias de criptomoedas em exchanges. Use sempre hardware wallets para máxima segurança!</p>
      <a href="https://a-cifra.com.br/artigo/ledger-vs-trezor-review">→ Veja nosso review completo de hardware wallets</a>
    </div>
  </div>

  <div class="footer">
    <p>Você está recebendo este email porque se inscreveu na newsletter da A Cifra</p>
    <p>
      <a href="https://a-cifra.com.br">Visite nosso site</a> |
      <a href="#">Descadastrar</a>
    </p>
    <p>© ${new Date().getFullYear()} A Cifra - Todos os direitos reservados</p>
  </div>
</body>
</html>
  `;

  return html;
}

function main() {
  console.log('📧 Gerador de Newsletter Semanal - A Cifra\n');
  console.log('═'.repeat(50));

  // 1. Buscar artigos da última semana
  const articles = getArticlesFromLastWeek();
  console.log(`\n📚 ${articles.length} artigos publicados esta semana\n`);

  if (articles.length === 0) {
    console.log('⚠️  Nenhum artigo novo esta semana. Newsletter não gerada.\n');
    return;
  }

  // 2. Gerar HTML
  const html = generateNewsletterHTML(articles);

  // 3. Salvar newsletter
  const newsletterDir = path.join(__dirname, '../newsletters');
  if (!fs.existsSync(newsletterDir)) {
    fs.mkdirSync(newsletterDir, { recursive: true });
  }

  const date = new Date().toISOString().split('T')[0];
  const filename = `newsletter-${date}.html`;
  const outputPath = path.join(newsletterDir, filename);

  fs.writeFileSync(outputPath, html);

  console.log(`✅ Newsletter gerada: ${filename}`);
  console.log(`📄 Salva em: newsletters/${filename}\n`);
  console.log('📨 Próximo passo: Enviar via serviço de email (ex: Resend, SendGrid)\n');

  // 4. Gerar preview
  console.log('═'.repeat(50));
  console.log('\n📋 PREVIEW DA NEWSLETTER:\n');

  articles.forEach((article, idx) => {
    console.log(`${idx + 1}. ${article.title}`);
    console.log(`   📂 ${article.category}`);
    console.log(`   🔗 ${article.url}\n`);
  });
}

main();
