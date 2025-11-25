'use client'

import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

interface NewsletterCTAProps {
  variant?: 'inline' | 'sidebar' | 'footer'
  className?: string
}

export function NewsletterCTA({ variant = 'inline', className = '' }: NewsletterCTAProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus('success')
        setMessage(data.message || 'Inscrição realizada com sucesso!')
        setEmail('')
        
        // Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'newsletter_signup', {
            event_category: 'engagement',
            event_label: 'newsletter_cta'
          })
        }
      } else {
        throw new Error(data.error || 'Erro ao inscrever')
      }
    } catch (error: any) {
      setStatus('error')
      setMessage(error.message || 'Erro ao inscrever. Tente novamente.')
    }

    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 5000)
  }

  const variants = {
    inline: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-xl',
    sidebar: 'bg-gray-50 dark:bg-gray-800 p-6 rounded-lg',
    footer: 'bg-gray-900 text-white p-6 rounded-lg',
  }

  return (
    <div className={`${variants[variant]} ${className}`}>
      <div className="flex items-start space-x-3 mb-4">
        <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-bold mb-2">
            📈 Newsletter A Cifra
          </h3>
          <p className="text-sm opacity-90">
            Receba análises exclusivas, alertas de mercado e as melhores oportunidades em cripto direto no seu email.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          disabled={status === 'loading' || status === 'success'}
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
        />
        
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="w-full px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Inscrevendo...' : status === 'success' ? 'Inscrito!' : 'Quero Receber'}
        </button>
      </form>

      {message && (
        <div className={`mt-3 flex items-center space-x-2 text-sm ${
          status === 'success' ? 'text-green-300' : 'text-red-300'
        }`}>
          {status === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{message}</span>
        </div>
      )}

      <p className="text-xs opacity-75 mt-3">
        🔒 Seus dados estão seguros. Sem spam.
      </p>
    </div>
  )
}
