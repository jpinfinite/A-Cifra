import { MainLayout } from '@/components/layout'
import { Container, Heading, Text, Button } from '@/components/ui'
import Link from 'next/link'

export default function NotFound() {
  return (
    <MainLayout>
      <Container className="py-16">
        <div className="text-center max-w-md mx-auto">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-brand-primary-blue mb-4">404</div>
            <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33m0 0l-.431-.431A7.963 7.963 0 016 10.5a7.963 7.963 0 01.49-2.675m0 0L6 6.5a7.963 7.963 0 011.5-1.5m0 0L9 3.5a7.963 7.963 0 013-1.5m0 0L15 3.5a7.963 7.963 0 013 1.5m0 0L19.5 6.5a7.963 7.963 0 011.5 1.5m0 0l.431.431A7.963 7.963 0 0121 10.5a7.963 7.963 0 01-.49 2.675"
                />
              </svg>
            </div>
          </div>

          <Heading level={1} className="mb-4">
            Página não encontrada
          </Heading>
          
          <Text className="text-gray-600 mb-8">
            Ops! A página que você está procurando não existe ou foi movida. 
            Que tal explorar nossos artigos mais recentes?
          </Text>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/">
                Voltar ao Início
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/artigos">
                Ver Todos os Artigos
              </Link>
            </Button>
          </div>

          {/* Popular Categories */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Text size="sm" className="text-gray-500 mb-4">
              Ou explore por categoria:
            </Text>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { name: 'Bitcoin', slug: 'bitcoin' },
                { name: 'DeFi', slug: 'defi' },
                { name: 'NFTs', slug: 'nfts' },
                { name: 'Análises', slug: 'analises' }
              ].map((category) => (
                <Link
                  key={category.slug}
                  href={`/categoria/${category.slug}`}
                  className="px-3 py-1 text-sm bg-brand-off-white text-brand-primary-blue rounded-full hover:bg-brand-primary-blue hover:text-white transition-colors duration-200"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </MainLayout>
  )
}