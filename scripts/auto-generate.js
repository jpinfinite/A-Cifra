const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Carregar variáveis de ambiente
// Carregar variáveis de ambiente
// Carregar variáveis de ambiente (Forçando leitura do .env.antigravity)
const envPath = path.join(__dirname, '../.env.antigravity');
const result = require('dotenv').config({ path: envPath });

console.log('Env loaded:', result.parsed ? Object.keys(result.parsed) : 'None');

if (!process.env.GEMINI_API_KEY) {
    if (result.parsed && result.parsed.GEMINI_API_KEY) {
        process.env.GEMINI_API_KEY = result.parsed.GEMINI_API_KEY;
    }
}

const CONTENT_DIR = path.join(__dirname, '../content/articles');

const GENERATOR_MODEL = 'gemini-1.5-flash-latest'; // Modelo listado na API

// Lista de Tópicos para rotação
const TOPICS = [
  "Ethereum Layer 2 Ranking 2025",
  "Melhores DeFis para Staking de Stablecoins",
  "Análise de Preço Bitcoin Pós-Halving",
  "Solana vs Ethereum: Comparativo 2025",
  "Jogos Web3 que Pagam de Verdade",
  "RWA: Imóveis na Blockchain",
  "Inteligência Artificial e Cripto: Projetos para Olhar",
  "Como proteger sua Metamask de Phishing",
  "Airdrops Confirmados para 2025",
  "Tokenização de Títulos Públicos",
  "Cardano: Atualizações e Roteiro 2025",
  "Polkadot 2.0: O que muda?",
  "Melhores Carteiras de Hardware Custo-Benefício",
  "Regulação Cripto no Brasil: Guia 2025",
  "ETFs de Ethereum: Impacto no Preço",
  "Memecoins: Risco x Retorno",
  "Chainlink e a Interoperabilidade",
  "Avalanche vs Polygon: Qual é melhor para DeFi?",
  "Drex: O Real Digital e o impacto no mercado",
  "Binance vs Coinbase: Qual escolher em 2025?",
  "Stablecoins Algorítmicas: Ainda existem?",
  "Como declarar Bitcoin no Imposto de Renda 2025",
  "Criptomoedas de Privacidade",
  "Cosmos Atom: Internet das Blockchains",
  "Arbitrum vs Optimism",
  "Base (Coinbase L2): Ecossistema",
  "Toncoin e o Telegram",
  "Near Protocol: Sharding explicado",
  "Render Network e IA",
  "Fetch.ai e Agentes Autônomos"
];

// Prompt System (Antigravity Final)
const SYSTEM_PROMPT = `
Você é um agente de geração de conteúdo do site a-cifra.com.br, especializado em Google Discover e monetização com AdSense.

Objetivo:
Gerar um artigo JSON ESTRUTURADO pronto para publicação, otimizado para Discover, RPM alto e leitura mobile.

Estrutura JSON Obrigatória:
{
  "slug": "slug-otimizado-seo",
  "title": "Headline Curiosa e Viral (Estilo Discover)",
  "subtitle": "Subtítulo engajador que complementa o título",
  "lcpImage": "/images/articles/nome-da-imagem.webp",
  "intro": "Parágrafo de introdução curto (máx 4 linhas) e direto.",
  "blocks": [
    { "type": "text", "content": "..." },
    { "type": "text", "content": "..." },
    { "type": "ad", "slot": "article-middle" },
    { "type": "text", "content": "..." }
  ],
  "conclusion": "Conclusão breve com CTA neutro."
}

Regras:
- Use apenas { "type": "ad", "slot": "article-middle" } uma vez, no meio do conteúdo.
- Conteúdo em Markdown nos blocos de texto.
- Não use tags HTML.
- Foco em qualidade, autoridade e retenção.
- Mobile-first: parágrafos curtos.
- Use '/images/default.jpg' como fallback se não tiver uma específica, ou sugira um caminho realista.
`;

async function generateArticle() {
  console.log('🤖 Iniciando geração automática de artigo...');

  // 1. Escolher Tópico
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  console.log(`📌 Tópico escolhido: ${topic}`);

  // 2. Configurar Gemini
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('❌ GEMINI_API_KEY não encontrada');
  }

  // Buscar modelo dinamicamente para evitar erro 404
  let selectedModel = GENERATOR_MODEL;
  try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
      const resp = await fetch(listUrl);
      const data = await resp.json();
      if (data.models) {
          const viable = data.models.find(m =>
              m.name.includes('gemini') &&
              m.supportedGenerationMethods.includes('generateContent') &&
              !m.name.includes('vision') // Evitar modelos só de imagem se houver
          );
          if (viable) {
              selectedModel = viable.name.replace('models/', '');
              console.log(`🧠 Modelo selecionado dinamicamente: ${selectedModel}`);
          }
      }
  } catch (e) {
      console.warn('⚠️ Falha ao listar modelos, usando fallback:', e.message);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: selectedModel });

  // 3. Gerar Conteúdo
  try {
    const msg = `Gere um artigo completo sobre: "${topic}". Siga estritamente o formato JSON.`;

    // Usar generateContent com prompt do sistema simulado (ou direto se suportado, mas flash 1.5 aceita instrução)
    const result = await model.generateContent({
        contents: [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT + "\n\n" + msg }] }
        ]
    });

    const response = await result.response;
    let text = response.text();

    // Limpar markdown block se houver ```json ... ```
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const articleData = JSON.parse(text);

    // 4. Validar e Salvar
    if (!articleData.slug || !articleData.title || !articleData.blocks) {
        throw new Error('JSON gerado inválido ou incompleto.');
    }

    // Adicionar data
    articleData.publishedAt = new Date().toISOString();
    articleData.category = 'criptomoedas'; // Default seguro

    const filePath = path.join(CONTENT_DIR, `${articleData.slug}.json`);

    if (fs.existsSync(filePath)) {
        console.log('⚠️ Artigo já existe. Pulando...');
        return; // Evita duplicidade
    }

    // Garantir dir
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(articleData, null, 2));
    console.log(`✅ Artigo salvo: ${articleData.slug}`);

    // 5. Git Commit & Push
    try {
        console.log('🔄 Executando Git Commit...');
        execSync(`git add "${filePath}"`);
        execSync(`git commit -m "auto: post ${articleData.slug} (Antigravity Bot)"`);

        console.log('🚀 Executando Git Push...');
        execSync('git push origin main');
        console.log('✅ Publicado com sucesso!');
    } catch (gitErr) {
        console.error('⚠️ Erro no Git:', gitErr.message);
    }

  } catch (error) {
    console.error('❌ Erro na geração:', error);
  }
}

// Executar
generateArticle();
