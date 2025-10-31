import { ImageManager } from '@/components/admin/ImageManager'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gerenciador de Imagens | A Cifra Admin',
  description: 'Gerencie e distribua imagens para artigos e cards',
  robots: 'noindex, nofollow'
}

export default function ImageManagerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ImageManager />
    </div>
  )
}
