
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuração
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8459278012:AAFqpBOyu43ToRMZ9uyCZ0Fd3rMEwi1enNA';
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1003353992395';

// Helper para enviar requisição ao Telegram
function sendTelegramMessage(endpoint, body) {
    return new Promise((resolve, reject) => {
        const url = new URL(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${endpoint}`);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (!json.ok) {
                        reject(new Error(`Erro Telegram: ${json.description}`));
                    } else {
                        resolve(json.result);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(JSON.stringify(body));
        req.end();
    });
}

async function postToTelegram(title, url, imageUrl) {
    console.log(`📡 Enviando para Telegram: "${title}"`);

    const caption = `
📰 *${title}*

👇 Leia a matéria completa:
${url}

📢 Assine: @Acifra\\_News
    `.trim();

    try {
        // Se tiver imagem, enviamos como Photo
        if (imageUrl && imageUrl.startsWith('http')) {
            await sendTelegramMessage('sendPhoto', {
                chat_id: TELEGRAM_CHANNEL_ID,
                photo: imageUrl,
                caption: caption,
                parse_mode: 'Markdown'
            });
        } else {
            // Se não, enviamos apenas texto
            await sendTelegramMessage('sendMessage', {
                chat_id: TELEGRAM_CHANNEL_ID,
                text: caption,
                parse_mode: 'Markdown'
            });
        }
        console.log('✅ Postado no Telegram com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao postar no Telegram:', error.message);
    }
}

// Handler para teste manual
// Uso: node scripts/telegram-poster.js "Titulo" "Link" "Img"
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length >= 2) {
        postToTelegram(args[0], args[1], args[2]);
    } else {
        console.log("Modo de teste: Enviando mensagem de boas vindas...");
        postToTelegram(
            "Bot A Cifra News Ativado! 🚀",
            "https://a-cifra.com.br",
            "https://a-cifra.com.br/images/logos/favcoin.png"
        );
    }
}

module.exports = { postToTelegram };
