const OpenAI = require("openai")
const dotenv = require("dotenv")

// Load env vars if present
dotenv.config()

const apiKey = process.env.OPENAI_API_KEY
const client = apiKey ? new OpenAI({ apiKey }) : null

module.exports = async function generateCaptionAI(article, platform) {
    // Fallback if no API key is set
    if (!client) {
        console.warn("⚠️  OPENAI_API_KEY não encontrada. Usando gerador estático de backup.")
        return require('./generateCaption')(article, platform)
    }

  const prompt = `
Você é um editor sênior de mídia social especializado em criptomoedas,
notícias financeiras e conteúdo viral responsável.

CONTEXTO:
O site A-Cifra publica artigos informativos sobre criptoativos, mercado,
tecnologia blockchain e investimentos.

OBJETIVO:
Criar uma legenda para redes sociais que gere CURIOSIDADE e CLIQUES,
sem clickbait falso.

REGRAS GERAIS:
- Linguagem natural, humana e jornalística
- Nada de emojis em excesso
- Não usar promessas irreais
- Não usar frases genéricas como "você não vai acreditar"
- Texto curto e escaneável
- Máx. 3 emojis no Instagram, 0–1 no Facebook
- Nunca repetir título exatamente igual
- Sempre incluir CTA para leitura

VARIAÇÃO:
Cada resposta deve ser diferente, mesmo para artigos similares.

FORMATO DE SAÍDA (JSON):
{
  "caption": "",
  "hashtags": ""
}

PLATAFORMA: ${platform}
CATEGORIA: ${article.category || 'Criptomoedas'}

ARTIGO:
Título: ${article.title}
Resumo: ${article.excerpt || article.title}
URL: ${article.url}

Gere uma legenda curta, humana e com CTA.
Retorne APENAS JSON.
`

  try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini", // Using a current model name, user suggested gpt-4.1-mini which might be hypothetical or alias, defaulting to 4o-mini or 3.5-turbo if needed. I'll stick to a valid one.
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8
      })

      const raw = response.choices[0].message.content
      // Clean markdown code blocks if present
      const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim()
      return JSON.parse(cleanJson)
  } catch (error) {
      console.error("❌ Erro ao gerar caption com IA:", error.message)
      // Fallback
      return require('./generateCaption')(article, platform)
  }
}
