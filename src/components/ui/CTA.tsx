import React from 'react';
import Link from 'next/link';

interface CTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: 'primary' | 'secondary' | 'newsletter';
  className?: string;
}

export default function CTA({
  title = '📈 Quer dominar o mercado crypto?',
  description = 'Receba análises exclusivas, guias práticos e as últimas notícias do mundo das criptomoedas diretamente no seu email.',
  buttonText = 'Começar Agora',
  buttonLink = '#newsletter',
  variant = 'primary',
  className = '',
}: CTAProps) {
  const variants = {
    primary: {
      container: 'bg-gradient-to-br from-brand-primary-blue to-brand-medium-blue',
      badge: 'bg-brand-gold/20 text-brand-gold border-brand-gold/30',
      title: 'text-white',
      description: 'text-gray-300',
      button: 'bg-brand-gold hover:bg-[#C5A028] text-brand-dark-blue',
    },
    secondary: {
      container: 'bg-gradient-to-br from-brand-dark-blue to-brand-primary-blue',
      badge: 'bg-white/10 text-white border-white/20',
      title: 'text-white',
      description: 'text-gray-200',
      button: 'bg-white hover:bg-gray-100 text-brand-primary-blue',
    },
    newsletter: {
      container: 'bg-gradient-to-r from-brand-gold/10 to-brand-primary-blue/10 border-2 border-brand-gold/20',
      badge: 'bg-brand-gold/20 text-brand-gold border-brand-gold/30',
      title: 'text-brand-dark-blue',
      description: 'text-gray-700',
      button: 'bg-brand-primary-blue hover:bg-brand-medium-blue text-white',
    },
  };

  const style = variants[variant];

  return (
    <div className={`relative overflow-hidden rounded-2xl p-8 md:p-12 ${style.container} ${className}`}>
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border backdrop-blur-sm ${style.badge}`}>
          <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
          Conteúdo Exclusivo
        </div>

        {/* Título */}
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${style.title}`}>
          {title}
        </h2>

        {/* Descrição */}
        <p className={`text-lg md:text-xl mb-8 leading-relaxed ${style.description}`}>
          {description}
        </p>

        {/* Botão */}
        <Link
          href={buttonLink}
          className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${style.button}`}
        >
          {buttonText}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>

        {/* Features */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm">
          <div className="flex items-center gap-2 opacity-90">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>100% Gratuito</span>
          </div>
          <div className="flex items-center gap-2 opacity-90">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Sem Spam</span>
          </div>
          <div className="flex items-center gap-2 opacity-90">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Cancele Quando Quiser</span>
          </div>
        </div>
      </div>
    </div>
  );
}
