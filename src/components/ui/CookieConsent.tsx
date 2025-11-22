'use client'

import { useState, useEffect } from 'react'
import { Button } from './Button'
import { cn } from '@/utils/cn'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Verifica se o usuário já aceitou os cookies
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-900',
        'border-t border-gray-200 dark:border-gray-700 shadow-lg',
        'animate-slide-up'
      )}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 
              id="cookie-consent-title" 
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
            >
              🍪 Cookies e Privacidade
            </h3>
            <p 
              id="cookie-consent-description" 
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Usamos cookies para melhorar sua experiência, analisar o tráfego do site e 
              personalizar conteúdo. Ao continuar navegando, você concorda com nossa{' '}
              <a 
                href="/politica-de-privacidade" 
                className="text-brand-primary-blue hover:underline"
              >
                Política de Privacidade
              </a>
              .
            </p>
          </div>
          
          <div className="flex gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              className="whitespace-nowrap"
            >
              Rejeitar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAccept}
              className="whitespace-nowrap"
            >
              Aceitar Cookies
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
