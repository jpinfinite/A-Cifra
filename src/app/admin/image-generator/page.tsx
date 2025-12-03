'use client'

import { useState } from 'react'
import { Container, Heading, Text, Button } from '@/component

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [articleSlug, setArticleSlug] = useState('')
  const [style, setStyle] = useState<'professional' | 'modern' | 'minimalist' | 'vibrant'>('professional')
  const [loading, setLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function generateImage() {
    if (!prompt.trim()) {
      setError('Digite um prompt para gerar a imagem')
      return
    }

    setLoading(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          articleSlug: articleSlug || undefined,
          style
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar imagem')
      }

      const data = await response.json()
      setGeneratedImage(data.image)
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar imagem')
    } finally {
      setLoading(false)
    }
  }

  function downloadImage() {
    if (!generatedImage) return

    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `${articleSlug || 'cover'}-${Date.now()}.png`
    link.click()
  }

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <Heading level={1} className="mb-4">
          🎨 Gerador de Imagens para Artigos
        </Heading>
        <Text className="mb-8 text-gray-600">
          Use IA (FLUX 2 Dev) para gerar capas profissionais para seus artigos
        </Text>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="space-y-6">
            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt (Descrição da Imagem)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Bitcoin cryptocurrency chart showing bullish trend, golden coins, modern financial illustration"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-blue focus:border-transparent outline-none"
                rows={4}
              />
              <Text className="text-sm text-gray-500 mt-2">
                💡 Dica: Seja específico! Mencione cores (azul e dourado), estilo, elementos visuais
              </Text>
            </div>

            {/* Slug do Artigo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug do Artigo (opcional)
              </label>
              <input
                type="text"
                value={articleSlug}
                onChange={(e) => setArticleSlug(e.target.value)}
                placeholder="bitcoin-analise-2025"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-blue focus:border-transparent outline-none"
              />
            </div>

            {/* Estilo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estilo
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['professional', 'modern', 'minimalist', 'vibrant'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${style === s
                        ? 'border-brand-primary-blue bg-brand-primary-blue text-white'
                        : 'border-gray-300 hover:border-brand-primary-blue'
                      }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Botão Gerar */}
            <Button
              onClick={generateImage}
              disabled={loading || !prompt.trim()}
              className="w-full py-4 text-lg"
            >
              {loading ? '🎨 Gerando imagem...' : '✨ Gerar Imagem com IA'}
            </Button>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <Text className="text-red-800">❌ {error}</Text>
          </div>
        )}

        {/* Imagem Gerada */}
        {generatedImage && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Heading level={2} className="mb-4">
              ✅ Imagem Gerada!
            </Heading>

            <div className="mb-6">
              <img
                src={generatedImage}
                alt="Imagem gerada"
                className="w-full rounded-lg shadow-md"
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={downloadImage} className="flex-1">
                📥 Baixar Imagem
              </Button>
              <Button
                onClick={() => {
                  setGeneratedImage(null)
                  setPrompt('')
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700"
              >
                🔄 Gerar Nova
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <Text className="text-sm text-blue-800">
                💡 <strong>Próximo passo:</strong> Salve a imagem em <code>/public/images/</code> e use no frontmatter do artigo
              </Text>
            </div>
          </div>
        )}

        {/* Exemplos de Prompts */}
        <div className="mt-12 bg-gray-50 rounded-xl p-8">
          <Heading level={3} className="mb-4">
            📝 Exemplos de Prompts
          </Heading>
          <div className="space-y-4">
            {[
              'Bitcoin cryptocurrency chart showing bullish trend, golden coins floating, blue and gold color scheme, professional financial illustration',
              'Ethereum blockchain network visualization, glowing nodes connected, futuristic technology, purple and blue colors, modern digital art',
              'DeFi concept illustration, decentralized finance symbols, coins and smart contracts, minimalist clean design, blue gradient background',
              'NFT digital art marketplace, colorful abstract art pieces, vibrant energetic style, modern gallery concept',
              'Cryptocurrency trading dashboard, multiple charts and graphs, professional financial interface, dark theme with blue accents'
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="w-full text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-brand-primary-blue transition-colors"
              >
                <Text className="text-sm text-gray-700">{example}</Text>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
