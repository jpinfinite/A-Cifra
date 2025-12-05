/**
 * Assistente de Configuração de Variáveis de Ambiente
 * Execute: node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n🔧 Assistente de Configuração - A Cifra\n');
  console.log('═'.repeat(60));
  console.log('\nVamos configurar suas variáveis de ambiente passo a passo.\n');

  const config = {};

  // 1. Cloudflare (essencial)
  console.log('\n📌 1. CLOUDFLARE AI (Essencial para geração de imagens)\n');

  config.CLOUDFLARE_API_TOKEN = await question('   API Token: ');
  config.CLOUDFLARE_ACCOUNT_ID = await question('   Account ID: ');

  // 2. GitHub (para CI/CD)
  console.log('\n📌 2. GITHUB (Para automação via Actions)\n');
  console.log('   ℹ️  Gere um token em: https://github.com/settings/tokens');
  console.log('   Permissões necessárias: repo, workflow\n');

  const needsGithub = await question('   Configurar GitHub Token agora? (s/n): ');
  if (needsGithub.toLowerCase() === 's') {
    config.GITHUB_TOKEN = await question('   GitHub Token: ');
  }

  // 3. Resend (newsletter)
  console.log('\n📌 3. RESEND (Para envio de newsletters - OPCIONAL)\n');
  console.log('   ℹ️  Cadastre-se em: https://resend.com\n');

  const needsResend = await question('   Configurar Resend agora? (s/n): ');
  if (needsResend.toLowerCase() === 's') {
    config.RESEND_API_KEY = await question('   Resend API Key: ');
  }

  // 4. Telegram (notificações)
  console.log('\n📌 4. TELEGRAM (Para notificações - OPCIONAL)\n');
  console.log('   ℹ️  Crie um bot com @BotFather no Telegram\n');

  const needsTelegram = await question('   Configurar Telegram agora? (s/n): ');
  if (needsTelegram.toLowerCase() === 's') {
    config.TELEGRAM_BOT_TOKEN = await question('   Bot Token: ');
    config.TELEGRAM_CHAT_ID = await question('   Chat ID: ');
  }

  // 5. Discord (alternativa)
  console.log('\n📌 5. DISCORD (Alternativa ao Telegram - OPCIONAL)\n');

  const needsDiscord = await question('   Configurar Discord Webhook? (s/n): ');
  if (needsDiscord.toLowerCase() === 's') {
    config.DISCORD_WEBHOOK_URL = await question('   Webhook URL: ');
  }

  // Configurações gerais
  config.NODE_ENV = 'production';
  config.SITE_URL = 'https://a-cifra.com.br';

  // Gerar arquivo .env
  console.log('\n✅ Configuração concluída! Gerando arquivo .env...\n');

  let envContent = '# Gerado automaticamente por setup-env.js\n';
  envContent += `# Data: ${new Date().toISOString()}\n\n`;

  for (const [key, value] of Object.entries(config)) {
    envContent += `${key}=${value || ''}\n`;
  }

  const envPath = path.join(__dirname, '../.env');
  fs.writeFileSync(envPath, envContent);

  console.log('═'.repeat(60));
  console.log('\n🎉 Arquivo .env criado com sucesso!\n');
  console.log('📄 Localização: .env');
  console.log('\n⚠️  IMPORTANTE:');
  console.log('   - Este arquivo nunca será commitado (está no .gitignore)');
  console.log('   - Para GitHub Actions, configure GitHub Secrets manualmente');
  console.log('   - Guarde suas credenciais em local seguro\n');

  // Instruções para GitHub Secrets
  console.log('📋 PRÓXIMO PASSO: Configurar GitHub Secrets\n');
  console.log('   1. Acesse: https://github.com/jpinfinite/A-Cifra/settings/secrets/actions');
  console.log('   2. Clique em "New repository secret"');
  console.log('   3. Adicione cada variável:\n');

  if (config.CLOUDFLARE_API_TOKEN) {
    console.log(`      - Nome: CLOUDFLARE_API_TOKEN`);
    console.log(`        Valor: ${config.CLOUDFLARE_API_TOKEN}\n`);
  }

  if (config.CLOUDFLARE_ACCOUNT_ID) {
    console.log(`      - Nome: CLOUDFLARE_ACCOUNT_ID`);
    console.log(`        Valor: ${config.CLOUDFLARE_ACCOUNT_ID}\n`);
  }

  if (config.TELEGRAM_BOT_TOKEN) {
    console.log(`      - Nome: TELEGRAM_BOT_TOKEN`);
    console.log(`        Valor: ${config.TELEGRAM_BOT_TOKEN}\n`);
    console.log(`      - Nome: TELEGRAM_CHAT_ID`);
    console.log(`        Valor: ${config.TELEGRAM_CHAT_ID}\n`);
  }

  console.log('═'.repeat(60));
  console.log('\n✨ Tudo pronto! Execute os scripts de automação agora.\n');

  rl.close();
}

main().catch(console.error);
