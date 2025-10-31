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
