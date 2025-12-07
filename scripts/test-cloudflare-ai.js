/**
 * TESTE IA CLOUDFLARE (LLAMA 3)
 * Gera um artigo de teste usando o modelo mais avançado disponível gratuitamente
 */

const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';

async function testAI() {
  console.log('🤖 Conectando com Cloudflare AI (Llama-3.1-8B)...');
  console.log('📝 Tema: "O Futuro do Bitcoin em 2030" (Teste de qualidade)');

  const prompt = `
  Escreva um artigo técnico e profundo sobre "O Futuro do Bitcoin em 2030".

  Estrutura obrigatória:
  1. Introdução impactante sobre escassez digital.
  2. Análise sobre adoção institucional (BlackRock, Bancos).
  3. Previsão de impacto do Halving de 2028.
  4. Conclusão filosófica sobre soberania financeira.

  Tom de voz: Especialista, analítico, sério (sem gírias).
  Língua: Português do Brasil.
  Tamanho: Mínimo 800 palavras.
  `;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Você é um analista sênior de criptomoedas e economista." },
            { role: "user", content: prompt }
          ],
          max_tokens: 3000 // Permitir resposta longa
        })
      }
    );

    const result = await response.json();

    if (!result.success) {
        throw new Error(`Erro API: ${JSON.stringify(result.errors)}`);
    }

    console.log('\n✨ RESPOSTA GERADA:\n');
    console.log('═'.repeat(50));
    console.log(result.result.response);
    console.log('═'.repeat(50));

    // Salvar num arquivo para inspecionarmos
    const fs = require('fs');
    fs.writeFileSync('teste_artigo_ia.md', result.result.response);
    console.log('\n📄 Salvo em: teste_artigo_ia.md');

  } catch (error) {
    console.error('❌ Falha:', error.message);
  }
}

testAI();
