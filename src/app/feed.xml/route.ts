import RSS from 'rss';
import { getRecentArticles } from '@/data/articles';

export async function GET() {
  const feed = new RSS({
    title: 'A Cifra — Notícias Crypto & Blockchain',
    description: 'Análises aprofundadas, notícias atualizadas e educação sobre Bitcoin, Ethereum e Web3.',
    site_url: 'https://a-cifra.com.br',
    feed_url: 'https://a-cifra.com.br/feed.xml',
    copyright: `${new Date().getFullYear()} A Cifra`,
    language: 'pt-BR',
    pubDate: new Date(),
  });

  const articles = await getRecentArticles(20, 'pt-BR');

  articles.forEach((article) => {
    feed.item({
      title: article.title,
      description: article.excerpt,
      url: `https://a-cifra.com.br/artigo/${article.slug}`,
      guid: article.id,
      date: article.publishedAt,
      author: article.author?.name || 'A Cifra Team',
      categories: [article.category],
      enclosure: article.coverImage ? {
        url: article.coverImage.src.startsWith('http')
             ? article.coverImage.src
             : `https://a-cifra.com.br${article.coverImage.src}`,
        type: 'image/jpeg'
      } : undefined
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  });
}
