
/**
 * Pinterest Poster - A Cifra
 * Script para postar pins automaticamente via API do Pinterest (v5)
 *
 * Requisitos:
 * 1. PINTEREST_ACCESS_TOKEN no arquivo .env
 * 2. PINTEREST_BOARD_ID no arquivo .env
 *
 * Uso:
 * - Listar boards: node scripts/pinterest-poster.js --list-boards
 * - Postar: node scripts/pinterest-poster.js --post --image "path/to/img.jpg" --title "Titulo" --desc "Desc" --link "https://..."
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');

const API_URL = 'https://api.pinterest.com/v5';
const TOKEN = process.env.PINTEREST_ACCESS_TOKEN;
const BOARD_ID = process.env.PINTEREST_BOARD_ID;

// Helper para requests HTTP
async function pinterestRequest(endpoint, method = 'GET', body = null) {
    if (!TOKEN) throw new Error('PINTEREST_ACCESS_TOKEN não configurado no .env');

    return new Promise((resolve, reject) => {
        const url = new URL(API_URL + endpoint);
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode >= 400) {
                        reject(new Error(JSON.stringify(json) || res.statusMessage));
                    } else {
                        resolve(json);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function listBoards() {
    console.log('📡 Buscando boards...');
    try {
        const data = await pinterestRequest('/boards');
        console.log('\n✅ Seus Boards:');
        data.items.forEach(board => {
            console.log(`- [${board.name}]: ID ${board.id}`);
        });
        console.log('\nCopie o ID do board desejado para o seu .env como PINTEREST_BOARD_ID');
    } catch (error) {
        console.error('❌ Erro ao listar boards:', error.message);
    }
}

async function createPin(imagePath, title, description, link) {
    if (!BOARD_ID) throw new Error('PINTEREST_BOARD_ID não configurado no .env');

    // Pinterest API v5 requer upload de imagem via URL pública ou Media Upload flow.
    // Para simplificar, assumimos que a imagem já está hospedada se for URL.
    // Se for local, precisaríamos fazer upload primeiro.
    // Como o site é estático (GitHub Pages/Cloudflare), podemos usar a URL final da imagem no site.

    console.log(`📌 Criando Pin: "${title}"`);

    // Verificar se link da imagem é valido
    let mediaSource;

    if (imagePath.startsWith('http')) {
        mediaSource = {
            source_type: 'image_url',
            url: imagePath
        };
    } else {
        // Se for local, tentamos converter para URL do site (assumindo deploy)
        // Isso é arriscado se o deploy não terminou.
        // O ideal para envio local é a API de "Upload Media", que é mais complexa (2 steps).
        // Vamos alertar o usuário.
        console.log('⚠️ Aviso: Imagens locais precisam estar online. Tentando converter para URL do site...');
        const filename = path.basename(imagePath);
        // Assumindo estrutura padrão do site
        const onlineUrl = `https://a-cifra.com.br/images/articles/${filename}`; // Ajustar path conforme necessario

        mediaSource = {
            source_type: 'image_url',
            url: onlineUrl
        };
    }

    const payload = {
        board_id: BOARD_ID,
        title: title.substring(0, 100),
        description: description.substring(0, 500),
        link: link,
        media_source: mediaSource
    };

    try {
        const res = await pinterestRequest('/pins', 'POST', payload);
        console.log(`✅ Pin criado com sucesso! ID: ${res.id}`);
        console.log(`🔗 Link: https://pinterest.com/pin/${res.id}`);
        return res;
    } catch (error) {
        console.error('❌ Erro ao criar Pin:', error.message);
    }
}

// CLI Handler
const args = process.argv.slice(2);
if (args.includes('--list-boards')) {
    listBoards();
} else if (args.includes('--post')) {
    const getArg = (name) => {
        const idx = args.indexOf(name);
        return idx !== -1 ? args[idx + 1] : null;
    };

    const img = getArg('--image');
    const title = getArg('--title');
    const desc = getArg('--desc');
    const link = getArg('--link');

    if (img && title && link) {
        createPin(img, title, desc || title, link);
    } else {
        console.log('❌ Uso incorreto. Requer --image, --title e --link');
    }
} else {
    console.log('ℹ️ Comandos disponíveis:');
    console.log('  --list-boards');
    console.log('  --post --image <URL> --title <TXT> --link <URL>');
}
