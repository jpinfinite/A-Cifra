const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');
const matter = require('gray-matter');

async function postToMedium(articlePath) {
    console.log('Ⓜ️  Iniciando Medium Poster...');

    if (!fs.existsSync(articlePath)) {
        console.error('❌ Artigo não encontrado.');
        return;
    }

    // Processar Conteúdo
    const fileContent = fs.readFileSync(articlePath, 'utf8');
    const { data, content } = matter(fileContent);
    const title = data.title || 'Novo Artigo Crypto';
    const slug = path.basename(articlePath, '.md');
    const canonicalUrl = `https://a-cifra.com.br/artigo/${slug}`;

    // Preparar texto para o Medium
    // Remover quebras excessivas e adicionar footer canonical
    let bodyText = content.replace(/^#\s+.*\n/gm, ''); // Remove titulo repetido se houver h1 no corpo
    bodyText += `\n\n---\n\n📰 Publicado originalmente em A Cifra:\n${canonicalUrl}`;

    const botProfileDir = path.join(os.homedir(), '.chrome-bot-profile');

    if (!fs.existsSync(botProfileDir)) {
        console.error('❌ Perfil do bot não encontrado!');
        return;
    }

    try {
        const browser = await puppeteer.launch({
            userDataDir: botProfileDir,
            headless: false,
            ignoreDefaultArgs: ['--enable-automation'],
            args: ['--start-maximized', '--no-sandbox', '--disable-blink-features=AutomationControlled']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 }); // Desktop

        console.log('   🔗 Acessando editor do Medium...');
        await page.goto('https://medium.com/new-story', { waitUntil: 'networkidle2' });

        if (page.url().includes('signin') || page.url().includes('login')) {
            console.error('   ❌ Não logado no Medium!');
            await browser.close();
            return;
        }

        console.log('   ✍️  Escrevendo...');

        // Título
        // O Medium usa contenteditable. O Título geralmente é o primeiro h3 ou data-testid="editorTitle"
        // Mas a estrutura muda. Geralmente o foco inicial já está no título ou placeholder 'Title'.

        // Clicar no campo de titulo
        try {
            // Tenta achar campo de titulo pela placeholder ou classe h3
            const titleSel = 'h3.graf--title, [data-testid="editorTitle"], [placeholder="Title"]';
            await page.waitForSelector(titleSel, { timeout: 5000 });
            await page.click(titleSel);
            await page.type(titleSel, title, { delay: 30 });
            await page.keyboard.press('Enter'); // Ir para corpo
        } catch (e) {
            console.log('   ⚠️ Campo de título específico não achado, tentando foco automático...');
            await page.keyboard.type(title);
            await page.keyboard.press('Enter');
        }

        await new Promise(r => setTimeout(r, 1000));

        // Corpo
        // Hack: Copiar colar texto é mais rápido e confiável que digitar caractere por caractere para textos longos
        // Mas puppeteer clipboard é chato. Vamos digitar o começo e colar o resto ou digitar rápido.
        // Texto muito longo pode demorar. Vamos usar page.evaluate para inserir texto se possivel.

        console.log('   📝 Inserindo conteúdo...');
        const pSelector = 'p.graf--p, [data-testid="editorParagraph"], [role="textbox"] p';

        // Digitar parágrafo por parágrafo para formatar melhor
        const paragraphs = bodyText.split('\n').filter(p => p.trim().length > 0);

        // Limitar para não demorar horas no teste
        const maxParas = 15; // Postar intro

        for (let i = 0; i < Math.min(paragraphs.length, maxParas); i++) {
            await page.keyboard.type(paragraphs[i]);
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 100));
        }

        if (paragraphs.length > maxParas) {
            await page.keyboard.type('\n(Leia o artigo completo no link abaixo...)\n');
        }

        // Link Final
        await page.keyboard.type(`\nFonte: ${canonicalUrl}`);

        await new Promise(r => setTimeout(r, 2000));

        // Helper de clique por texto (robusto)
        const clickByText = async (textOptions) => {
            const buttons = await page.$$('button');
            for (const btn of buttons) {
                const t = await page.evaluate(e => e.textContent, btn);
                if (t && textOptions.some(opt => t.includes(opt))) {
                    await btn.click();
                    return true;
                }
            }
            return false;
        };

        console.log('   🚀 Publicando...');

        // Clicar em "Publish" (Botão verde em cima)
        if (await clickByText(['Publish'])) {
            await new Promise(r => setTimeout(r, 2000));
            // Confirmar "Publish now" no modal
            if (await clickByText(['Publish now'])) {
                 console.log('   ✅ Publicado no Medium!');
                 await new Promise(r => setTimeout(r, 5000));
            } else {
                 console.log('   ⚠️ Modal aberto, mas botão Publish now não achado (talvez peça tags).');
            }
        } else {
             console.error('   ❌ Botão Publish não encontrado.');
        }

        await browser.close();

    } catch (e) {
        console.error('   ❌ Erro Medium:', e.message);
    }
}

if (require.main === module) {
    const article = process.argv[2];
    postToMedium(article);
}

module.exports = { postToMedium };
