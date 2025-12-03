/**
 * Cloudflare Function: Generate Embeddings
 * Gera embeddings para todos os artigos
 */

interface Env {
  AI: any
  EMBEDDINGS: any
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
    const { articles } = await request.json()

    if (!articles || !Array.isArray(articles)) {
      return Response.json(
        { error: 'Articles array is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    console.log(`Generating embeddings for ${articles.length} articles...`)

    const embeddings = []
    let processed = 0

    for (const article of articles) {
      try {
        // Combinar título + excerpt + conteúdo para melhor contexto
        const text = `${article.title}. ${article.excerpt}. ${article.content.substring(0, 1000)}`

        const embedding = await env.AI.run('@cf/google/embeddinggemma-300m', {
          text: text,
        })

        embeddings.push({
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          category: article.category,
          embedding: embedding.data[0],
        })

        processed++
        console.log(`Processed ${processed}/${articles.length}: ${article.title}`)
      } catch (error: any) {
        console.error(`Error processing article ${article.id}:`, error)
      }
    }

    // Salvar no KV
    await env.EMBEDDINGS.put('all-embeddings', JSON.stringify(embeddings))

    console.log(`✅ Saved ${embeddings.length} embeddings to KV`)

    return Response.json(
      {
        success: true,
        processed: embeddings.length,
        total: articles.length,
        message: 'Embeddings generated and saved successfully',
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Generate embeddings error:', error)
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
