/**
 * Cloudflare Function: Generate Content
 * Gera conteúdo usando Llama 3.3 70B
 */

interface Env {
  AI: any
}

interface ContentRequest {
  topic: string
  keywords?: string[]
  type?: 'article' | 'faq' | 'summary' | 'meta'
  length?: 'short' | 'medium' | 'long'
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const {
      topic,
      keywords = [],
      type = 'article',
      length = 'medium',
    }: ContentRequest = await request.json()

    if (!topic || topic.trim().length === 0) {
      return Response.json(
        { error: 'Topic is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const prompt = buildPrompt(topic, keywords, type, length)

    console.log('Generating content with Llama 3.3 70B...')

    const response = await env.AI.run(
      '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      {
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(type),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: getMaxTokens(length),
        temperature: 0.7,
      }
    )

    return Response.json(
      {
        topic,
        type,
        content: response.response,
        tokens: response.tokens_used || 0,
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Generate content error:', error)
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

function getSystemPrompt(type: string): string {
  const prompts = {
    article: `Você é um especialista em criptomoedas que escreve artigos educativos em português brasileiro para o site A Cifra.

Seu estilo:
- Educacional mas acessível
- Técnico quando necessário, mas sempre explicando termos
- Baseado em dados e fatos
- Otimista sobre o futuro das criptos
- Transparente sobre riscos
- Usa exemplos práticos em R$ (Brasil)

Sempre inclua:
- Introdução contextualizada
- Seções bem estruturadas (H2, H3)
- Exemplos práticos
- Disclaimer de investimento
- Conclusão com resumo`,

    faq: `Você é um especialista em criptomoedas que cria FAQs educativas em português brasileiro.

Formato:
- Perguntas diretas e objetivas
- Respostas completas mas concisas (2-3 parágrafos)
- Linguagem acessível
- Exemplos quando relevante
- Otimizado para featured snippets do Google`,

    summary: `Você é um especialista que cria resumos concisos de conteúdo sobre criptomoedas em português brasileiro.

Formato:
- Resumo objetivo em 2-3 parágrafos
- Destaque dos pontos principais
- Linguagem clara e direta`,

    meta: `Você é um especialista em SEO que cria meta descriptions otimizadas em português brasileiro.

Formato:
- 150-160 caracteres
- Inclui keyword principal
- Call-to-action
- Atrativo para cliques`,
  }

  return prompts[type as keyof typeof prompts] || prompts.article
}

function buildPrompt(
  topic: string,
  keywords: string[],
  type: string,
  length: string
): string {
  const wordCounts = {
    short: '500-800',
    medium: '1500-2000',
    long: '3000-5000',
  }

  const prompts = {
    article: `Escreva um artigo completo sobre: ${topic}

${keywords.length > 0 ? `Keywords para incluir: ${keywords.join(', ')}` : ''}

Requisitos:
- ${wordCounts[length as keyof typeof wordCounts]} palavras
- Tom educacional e acessível
- Estrutura clara com H2 e H3
- Exemplos práticos em R$ (Brasil)
- Inclua disclaimer de investimento no final
- Otimizado para SEO

Formato Markdown com:
## Seções principais (H2)
### Subseções (H3)
- Listas quando apropriado
- **Negrito** para termos importantes
- Exemplos práticos`,

    faq: `Crie 10 perguntas e respostas (FAQ) sobre: ${topic}

Formato:
**Pergunta 1:** [pergunta direta]
**Resposta:** [resposta completa em 2-3 parágrafos]

Otimize para featured snippets do Google.`,

    summary: `Crie um resumo executivo sobre: ${topic}

Formato:
- 2-3 parágrafos
- Destaque os pontos principais
- Linguagem clara e objetiva`,

    meta: `Crie uma meta description otimizada para: ${topic}

Requisitos:
- 150-160 caracteres
- Inclua keyword principal
- Call-to-action
- Atrativo para cliques`,
  }

  return prompts[type as keyof typeof prompts] || prompts.article
}

function getMaxTokens(length: string): number {
  const tokens = {
    short: 1500,
    medium: 3000,
    long: 6000,
  }

  return tokens[length as keyof typeof tokens] || 3000
}

