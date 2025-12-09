/**
 * TWITTER API V2 - POSTAGEM AUTOMATIZADA
 * Usa a API oficial do Twitter para postar tweets
 * Requer credenciais da API (gratuito para uso básico)
 */

const https = require('https');
const crypto = require('crypto');

// Configuração da API do Twitter
const TWITTER_CONFIG = {
    apiKey: process.env.TWITTER_API_KEY || '',
    apiSecret: process.env.TWITTER_API_SECRET || '',
    accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
    bearerToken: process.env.TWITTER_BEARER_TOKEN || ''
};

/**
 * Gera assinatura OAuth 1.0a
 */
function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret = '') {
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    const signatureBase = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;

    return crypto.createHmac('sha1', signingKey).update(signatureBase).digest('base64');
}

/**
 * Gera header OAuth
 */
function generateOAuthHeader(method, url, params) {
    const oauthParams = {
        oauth_consumer_key: TWITTER_CONFIG.apiKey,
        oauth_token: TWITTER_CONFIG.accessToken,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_nonce: crypto.randomBytes(16).toString('hex'),
        oauth_version: '1.0'
    };

    const allParams = { ...oauthParams, ...params };
    const signature = generateOAuthSignature(
        method,
        url,
        allParams,
        TWITTER_CONFIG.apiSecret,
        TWITTER_CONFIG.accessTokenSecret
    );

    oauthParams.oauth_signature = signature;

    const authHeader = 'OAuth ' + Object.keys(oauthParams)
        .sort()
        .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
        .join(', ');

    return authHeader;
}

/**
 * Posta um tweet usando API v2
 */
async function postTweetAPI(text) {
    console.log('🐦 Postando via Twitter API v2...');

    // Verificar credenciais
    if (!TWITTER_CONFIG.apiKey || !TWITTER_CONFIG.apiSecret ||
        !TWITTER_CONFIG.accessToken || !TWITTER_CONFIG.accessTokenSecret) {
        console.error('❌ Credenciais da API não configuradas!');
        console.log('\n📚 COMO CONFIGURAR:');
        console.log('1. Acesse: https://developer.twitter.com/en/portal/dashboard');
        console.log('2. Crie um App (Free tier)');
        console.log('3. Gere as credenciais (API Key, API Secret, Access Token, Access Token Secret)');
        console.log('4. Configure as variáveis de ambiente:\n');
        console.log('   set TWITTER_API_KEY=sua_api_key');
        console.log('   set TWITTER_API_SECRET=sua_api_secret');
        console.log('   set TWITTER_ACCESS_TOKEN=seu_access_token');
        console.log('   set TWITTER_ACCESS_TOKEN_SECRET=seu_access_token_secret\n');
        return false;
    }

    const data = JSON.stringify({ text });

    const options = {
        hostname: 'api.twitter.com',
        port: 443,
        path: '/2/tweets',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'Authorization': `Bearer ${TWITTER_CONFIG.bearerToken}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 201) {
                    const response = JSON.parse(responseData);
                    console.log('✅ Tweet postado com sucesso!');
                    console.log(`🔗 Tweet ID: ${response.data.id}`);
                    console.log(`🌐 URL: https://twitter.com/user/status/${response.data.id}`);
                    resolve(true);
                } else {
                    console.error('❌ Erro ao postar tweet:');
                    console.error(`Status: ${res.statusCode}`);
                    console.error(`Resposta: ${responseData}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Erro na requisição:', error.message);
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

/**
 * Posta tweet com retry
 */
async function postTweetWithRetry(text, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const success = await postTweetAPI(text);
            if (success) return true;

            if (i < maxRetries - 1) {
                console.log(`⏳ Tentando novamente em 5 segundos... (${i + 1}/${maxRetries})`);
                await new Promise(r => setTimeout(r, 5000));
            }
        } catch (error) {
            if (i === maxRetries - 1) {
                console.error('❌ Falha após todas as tentativas');
                return false;
            }
        }
    }
    return false;
}

// CLI
if (require.main === module) {
    const message = process.argv[2] || "Teste A Cifra 🚀 #Bitcoin https://a-cifra.com.br";
    postTweetWithRetry(message);
}

module.exports = { postTweetAPI, postTweetWithRetry };
