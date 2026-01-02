module.exports = function generateCaption(article, platform) {
  if (platform === 'instagram') {
    return {
      caption: `🚨 ${article.title}

O mercado cripto pode estar prestes a um novo movimento importante.

Leia agora 👇
${article.url}`,
      hashtags: '#bitcoin #cripto #investimentos #blockchain #web3 #financas'
    }
  }

  if (platform === 'facebook') {
    return {
      caption: `${article.title}

Previsões, dados e o que pode acontecer nos próximos meses.
Leia o artigo completo 👇
${article.url}`,
      hashtags: '' // Facebook generally works better without cluttering hashtags in the caption, or very few.
    }
  }
}
