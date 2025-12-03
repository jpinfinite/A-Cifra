/**
 * Cloudflare Function: Generate Image
 * Gera imagens usando FLUX 2 Dev
 */

interface Env {
  AI: any
  R2_BUCKET: R2Bucket
}

interface ImageRequest {
  prompt: string
  articleSlug?: string
  style?: 'professional' | 'modern' | 'minimalist' | 'vibrant'
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
      prompt,
      articleSlug,
      style = 'professional',
    }: ImageRequest = await request.json()

    if (!prompt || prompt.trim().length === 0) {
      return Response.json(
        { error: 'Prompt is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Construir prompt otimizado
    const optimizedPrompt = buildImagePrompt(prompt, style)

    console.log('Generating image with FLUX 2 Dev...')
    console.log('Prompt:', optimizedPrompt)

    const response = await env.AI.run('@cf/black-forest-labs/flux-2-dev', {
      prompt: optimizedPrompt,
      num_steps: 20,
      guidance: 7.5,
    })

    // Salvar no R2 se articleSlug fornecido
    let imageUrl = null
    if (articleSlug && env.R2_BUCKET) {
      const filename = `articles/${articleSlug}-${Date.now()}.png`
      await env.R2_BUCKET.put(filename, response)
      imageUrl = `https://media.a-cifra.com.br/${filename}`
      console.log('Image saved to R2:', imageUrl)
    }

    // Retornar imagem como base64
    const arrayBuffer = await response.arrayBuffer()
    const base64 = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    )

    return Response.json(
      {
        success: true,
        prompt: optimizedPrompt,
        image: `data:image/png;base64,${base64}`,
        imageUrl: imageUrl,
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Generate image error:', error)
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

function buildImagePrompt(userPrompt: string, style: string): string {
  const stylePresets = {
    professional: 'professional, clean, corporate, high quality, detailed',
    modern: 'modern, sleek, contemporary, minimalist, elegant',
    minimalist: 'minimalist, simple, clean lines, uncluttered, refined',
    vibrant: 'vibrant, colorful, dynamic, energetic, bold',
  }

  const baseStyle = stylePresets[style as keyof typeof stylePresets] || stylePresets.professional

  return `${userPrompt}, ${baseStyle}, cryptocurrency theme, blue and gold color scheme, 1200x630 pixels, high resolution, professional photography, studio lighting, sharp focus, no text, no watermark`
}
