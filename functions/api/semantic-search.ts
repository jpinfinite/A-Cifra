/**
 * Cloudflare Function: Semantic Search
 * Busca semântica usando embeddings do EmbeddingGemma
 */

interface Env {
  AI: any
  EMBEDDINGS: KVNamespace
}

interface SearchRequest {
  query: string
  limit?: number
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, limit = 10 }: SearchRequest = await request.json()

    if (!query || query.trim().length === 0) {
      return Response.json(
        { error: 'Query is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // 1. Gerar embedding da query
    console.log('Generating query embedding...')
    const queryEmbedding = await env.AI.run('@cf/google/embeddinggemma-300m', {
      text: query,
    })

    // 2. Buscar todos os embeddings salvos
    console.log('Fetching article embeddings...')
    const embeddingsData = await env.EMBEDDINGS.get('all-embeddings', 'json')

    if (!embeddingsData) {
      return Response.json(
        { error: 'No embeddings found. Run generate-embeddings first.' },
        { status: 404, headers: corsHeaders }
      )
    }

    // 3. Calcular similaridade cosine
    const results = calculateSimilarity(
      queryEmbedding.data[0],
      embeddingsData,
      limit
    )

    return Response.json(
      {
        query,
        results,
        count: results.length,
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Semantic search error:', error)
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

/**
 * Calcula similaridade cosine entre query e artigos
 */
function calculateSimilarity(
  queryEmbedding: number[],
  articlesData: any[],
  limit: number
) {
  const similarities = articlesData.map((article) => {
    const similarity = cosineSimilarity(queryEmbedding, article.embedding)
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      similarity: similarity,
    }
  })

  // Ordenar por similaridade (maior primeiro)
  similarities.sort((a, b) => b.similarity - a.similarity)

  // Retornar top N
  return similarities.slice(0, limit)
}

/**
 * Calcula similaridade cosine entre dois vetores
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (normA * normB)
}
