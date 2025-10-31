'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { imagesCatalog, ImageMapping } from '@/utils/imageMapper'

interface ImageManagerProps {
  onSelectImage?: (image: ImageMapping) => void
}

export const ImageManager = ({ onSelectImage }: ImageManagerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImage, setSelectedImage] = useState<ImageMapping | null>(null)

  // Extrair categorias únicas
  const categories = useMemo(() => {
    const cats = new Set(imagesCatalog.map(img => img.category || 'geral'))
    return ['all', ...Array.from(cats).sort()]
  }, [])

  // Filtrar imagens
  const filteredImages = useMemo(() => {
    return imagesCatalog.filter(img => {
      const matchesCategory = selectedCategory === 'all' || img.category === selectedCategory
      const matchesSearch = searchTerm === '' || 
        img.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
      
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm])

  const handleImageClick = (image: ImageMapping) => {
    setSelectedImage(image)
    onSelectImage?.(image)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copiado para a área de transferência!')
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gerenciador de Imagens
        </h1>
        <p className="text-gray-600">
          {imagesCatalog.length} imagens disponíveis • {filteredImages.length} exibidas
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6 space-y-4">
        {/* Busca */}
        <div>
          <input
            type="text"
            placeholder="Buscar por palavra-chave ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Categorias */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'Todas' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              <span className="ml-2 text-sm opacity-75">
                ({imagesCatalog.filter(img => cat === 'all' || img.category === cat).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Imagens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {filteredImages.map((image, index) => (
          <div
            key={index}
            onClick={() => handleImageClick(image)}
            className={`group relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-xl ${
              selectedImage?.src === image.src ? 'ring-4 ring-blue-500' : ''
            }`}
          >
            {/* Imagem */}
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              
              {/* Overlay com categoria */}
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                  {image.category}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                {image.alt}
              </p>
              <div className="flex flex-wrap gap-1">
                {image.keywords.slice(0, 3).map((keyword, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {keyword}
                  </span>
                ))}
                {image.keywords.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    +{image.keywords.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detalhes da Imagem Selecionada */}
      {selectedImage && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-600 shadow-2xl p-6 z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Imagem Selecionada
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preview */}
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>

              {/* Informações */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Caminho da Imagem
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedImage.src}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedImage.src)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Texto Alternativo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedImage.alt}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedImage.alt)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código para Artigo
                  </label>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">
{`coverImage: {
  src: '${selectedImage.src}',
  alt: '${selectedImage.alt}',
  width: 1200,
  height: 630
}`}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(`coverImage: {\n  src: '${selectedImage.src}',\n  alt: '${selectedImage.alt}',\n  width: 1200,\n  height: 630\n}`)}
                      className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      Copiar Código
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Palavras-chave
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem quando não há resultados */}
      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nenhuma imagem encontrada com os filtros selecionados.
          </p>
        </div>
      )}
    </div>
  )
}
