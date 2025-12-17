'use client'

import { useEffect } from 'react'
import { Container, Heading, Text } from '@/components/ui'
import { MainLayout } from '@/components/layout'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <MainLayout>
      <Container className="py-8">
        <div className="text-center">
          <Heading level={1} className="mb-4">
            Ops! Algo deu errado
          </Heading>
          <Text className="mb-6">
            Ocorreu um erro inesperado. Nossa equipe já foi notificada e está trabalhando para resolver.
          </Text>
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left max-w-2xl mx-auto">
              <p className="text-sm font-mono text-red-800 mb-2">
                <strong>Erro:</strong> {error.message}
              </p>
              {error.stack && (
                <pre className="text-xs text-red-600 overflow-auto max-h-40">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
          <button
            onClick={reset}
            className="inline-block px-6 py-3 bg-brand-primary-blue text-white rounded-lg hover:bg-brand-medium-blue transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </Container>
    </MainLayout>
  )
}
