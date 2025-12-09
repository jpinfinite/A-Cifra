const facebookPoster = require('./facebook-poster.js');

async function teste() {
    console.log('📘 TESTE SHARE BUTTON FACEBOOK');
    // URL Real do seu site (baseada no print)
    const url = "https://a-cifra.com.br/artigo/blackrock-entra-com-pedido-de-listagem-de-etf-de-ether-em-staking";

    await facebookPoster.postToFacebook(url);
}

teste();
