const { exec } = require('child_process');
const path = require('path');

// Intervalo em minutos
const INTERVAL_MINUTES = 30;
const SCRIPT_PATH = path.join(__dirname, 'auto-generate.js');

console.log(`
===================================================
🚀 ANTIGRAVITY AUTO-PUBLISHER
===================================================
🕒 Intervalo: ${INTERVAL_MINUTES} minutos
📂 Script: ${SCRIPT_PATH}
===================================================
`);

function runGenerator() {
  console.log(`\n[${new Date().toLocaleTimeString()}] ⚡ Acionando gerador...`);

  const child = exec(`node "${SCRIPT_PATH}"`);

  child.stdout.on('data', (data) => console.log(data.toString()));
  child.stderr.on('data', (data) => console.error(data.toString()));

  child.on('exit', (code) => {
    console.log(`[${new Date().toLocaleTimeString()}] ✅ Processo finalizado (Código: ${code})`);
    console.log(`💤 Aguardando ${INTERVAL_MINUTES} minutos para o próximo ciclo...`);
  });
}

// Rodar imediatamente na inicialização
runGenerator();

// Agendar loops
setInterval(runGenerator, INTERVAL_MINUTES * 60 * 1000);
