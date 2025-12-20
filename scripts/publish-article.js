const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');

// 1️⃣ Receber JSON (via stdin)
let inputData = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  if (!inputData.trim()) {
    console.error("❌ Nenhum dado recebido via stdin.");
    process.exit(1);
  }

  try {
    const data = JSON.parse(inputData);

    // 2️⃣ Validar JSON Básico
    const required = ['slug', 'title', 'intro', 'blocks', 'conclusion'];
    for (const key of required) {
      if (!data[key]) {
        console.error(`❌ Campo obrigatório ausente: ${key}`);
        process.exit(1);
      }
    }

    if (!Array.isArray(data.blocks)) {
      console.error('❌ blocks deve ser um array');
      process.exit(1);
    }

    // Validar blocks e adicionar slots padrão se não tiverem
    let hasAd = false;
    data.blocks = data.blocks.map(block => {
        if (block.type === 'ad') {
            hasAd = true;
            if (!block.slot) block.slot = '2401624018'; // Default InArticle
        }
        return block;
    });

    // Se não tiver anúncio explícito e for longo, sugere inserir (mas aqui vamos confiar na geração)

    console.log('✅ JSON válido');

    // 3️⃣ Salvar Artigo
    const targetFile = path.join(CONTENT_DIR, `${data.slug}.json`);

    // Garantir diretório
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }

    fs.writeFileSync(targetFile, JSON.stringify(data, null, 2));
    console.log(`✅ Artigo salvo em: ${targetFile}`);

    // 4️⃣ Git Commit Automático
    try {
      execSync(`git add "${targetFile}"`);
      execSync(`git commit -m "auto: novo artigo ${data.slug} via Antigravity"`);
      console.log('✅ Commit realizado.');

      // Tentar push (pode falhar se não tiver credenciais configuradas no ambiente local, mas essencial para CI)
      // execSync('git push');
      // console.log('✅ Push realizado.');
      console.log('ℹ️ Execute "git push" para acionar o deploy no Cloudflare.');

    } catch (gitError) {
      console.warn('⚠️ Erro ao executar comandos git (talvez não seja um repo git ou sem user configurado):', gitError.message);
    }

  } catch (error) {
    console.error('❌ Erro ao processar JSON:', error.message);
    process.exit(1);
  }
});
