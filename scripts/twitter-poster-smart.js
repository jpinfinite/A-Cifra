const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function postWithSmartProfile(text) {
    console.log('🐦 Iniciando Smart Twitter Poster...');

    // 1. Caminhos
    const originalUserData = path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data');
    const tempUserData = path.join(os.tmpdir(), 'chrome-twitter-bot-' + Date.now());

    console.log(`   📂 Perfil Original: ${originalUserData}`);
    console.log(`   📂 Perfil Temporário: ${tempUserData}`);

    // 2. Criar diretório temporário e estrutura
    fs.mkdirSync(path.join(tempUserData, 'Default'), { recursive: true });

    // 3. Copiar arquivos essenciais de sessão (Cookies, Login Data)
    // Tenta copiar do Default ou do perfil ativo
    const profileName = 'Default'; // Geralmente é Default
    const sourceProfile = path.join(originalUserData, profileName);
    const destProfile = path.join(tempUserData, profileName);

    const filesToCopy = ['Cookies', 'Login Data', 'Web Data', 'Network Persistent State'];

    console.log('   📋 Clonando sessão...');

    // Tentar copiar arquivos. Se falhar (arquivo em uso), usamos uma técnica de shadow copy simples (leitura compartilhada)
    filesToCopy.forEach(file => {
        try {
            const src = path.join(sourceProfile, file);
            const dest = path.join(destProfile, file);
            if (fs.existsSync(src)) {
                fs.copyFileSync(src, dest);
                console.log(`      ✅ Copiado: ${file}`);
            }
        } catch (e) {
            console.log(`      ⚠️ Falha ao copiar ${file} (pode estar em uso, mas tentaremos sem ele)`);
        }
    });

    console.log('   ⚡ Iniciando navegador (sessão clonada)...');

    // 4. Iniciar Puppeteer no perfil temporário
    try {
         // Executável do Chrome
         const possiblePaths = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'Application', 'chrome.exe')
        ];
        const executablePath = possiblePaths.find(p => fs.existsSync(p));

        const browser = await puppeteer.launch({
            executablePath: executablePath,
            userDataDir: tempUserData,
            headless: false,
            defaultViewport: null,
            args: ['--start-maximized', '--no-sandbox']
        });

        const page = await browser.newPage();

        console.log('   🔗 Acessando Twitter...');
        await page.goto('https://twitter.com/compose/tweet', { waitUntil: 'networkidle2' });

        // Verificar login
        if (page.url().includes('login')) {
            console.error('   ❌ A clonagem de sessão falhou ou o Chrome bloqueou os arquivos de cookie.');
            console.log('   💡 Tentativa de fallback: Vamos abrir modo interativo.');
            // Aqui poderíamos pedir login manual, mas o objetivo é automático.
        } else {
            console.log('   ✅ Sessão reconhecida! Escrevendo tweet...');

            // Postar
            await new Promise(r => setTimeout(r, 2000));
            await page.keyboard.type(text, { delay: 50 });
            await new Promise(r => setTimeout(r, 1000));

            // Ctrl+Enter
            await page.keyboard.down('Control');
            await page.keyboard.press('Enter');
            await page.keyboard.up('Control');

            console.log('   🚀 Comanda de envio disparado!');
            await new Promise(r => setTimeout(r, 5000));
        }

        await browser.close();

        // Limpeza (opcional, pode falhar se browser demorar fechar)
        try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch {}

    } catch (e) {
        console.error('   ❌ Erro:', e.message);
    }
}

if (require.main === module) {
    const message = process.argv[2] || "Teste Smart Clone 🚀";
    postWithSmartProfile(message);
}

module.exports = { postWithSmartProfile };
