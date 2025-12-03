/**
 * Cloudflare Function: Text-to-Speech
 * Converte texto em áudio usando Aura 2
 */

interface Env {
  AI: any
  R2_BUCKET: any
}

interface TTSRequest {
  text: string
  articleSlug?: string
  voice?: 'professional' | 'casual' | 'energetic'
  language?: 'en' | 'es'
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
      text,
      articleSlug,
      voice = 'professional',
      language = 'en',
    }: TTSRequest = await request.json()

    if (!text || text.trim().length === 0) {
      return Response.json(
        { error: 'Text is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Limitar tamanho do texto (Aura tem limite)
    const maxChars = 5000
    const truncatedText = text.length > maxChars
      ? text.substring(0, maxChars) + '...'
      : text

    console.log('Generating audio with Aura 2...')
    console.log('Text length:', truncatedText.length)

    const model = language === 'es'
      ? '@cf/deepgram/aura-2-es'
      : '@cf/deepgram/aura-2-en'

    const response = await env.AI.run(model, {
      text: truncatedText,
      voice: voice,
    })

    // Salvar no R2 se articleSlug fornecido
    let audioUrl = null
    if (articleSlug && env.R2_BUCKET) {
      const filename = `podcasts/${articleSlug}-${Date.now()}.mp3`
      await env.R2_BUCKET.put(filename, response, {
        httpMetadata: {
          contentType: 'audio/mpeg',
        },
      })
      audioUrl = `https://media.a-cifra.com.br/${filename}`
      console.log('Audio saved to R2:', audioUrl)
    }

    // Retornar áudio
    return new Response(response, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': articleSlug
          ? `attachment; filename="${articleSlug}.mp3"`
          : 'attachment; filename="audio.mp3"',
        'X-Audio-URL': audioUrl || '',
      },
    })
  } catch (error: any) {
    console.error('Text-to-speech error:', error)
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
