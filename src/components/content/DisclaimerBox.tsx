import { DisclaimerBoxProps } from '@/types'

const disclaimerContent = {
  investment: {
    icon: '⚠️',
    title: 'Aviso de Investimento',
    content: 'Este artigo é apenas informativo e não constitui recomendação de investimento. Criptomoedas são ativos de alto risco. Sempre faça sua própria pesquisa (DYOR) e consulte um profissional financeiro antes de investir.'
  },
  general: {
    icon: 'ℹ️',
    title: 'Disclaimer',
    content: 'As informações contidas neste artigo são apenas para fins educacionais. Não nos responsabilizamos por decisões tomadas com base neste conteúdo.'
  },
  risk: {
    icon: '🚨',
    title: 'Aviso de Risco',
    content: 'Investimentos em criptomoedas envolvem riscos significativos, incluindo a possibilidade de perda total do capital investido. A volatilidade do mercado pode resultar em perdas substanciais.'
  }
}

export function DisclaimerBox({ type = 'investment', children }: DisclaimerBoxProps) {
  const disclaimer = disclaimerContent[type]

  return (
    <div className="my-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
      <div className="flex items-start">
        <span className="text-2xl mr-4 flex-shrink-0">{disclaimer.icon}</span>
        <div className="flex-1">
          <h4 className="font-bold text-yellow-800 text-lg mb-2">
            {disclaimer.title}
          </h4>
          <div className="text-yellow-700 leading-relaxed">
            {children || disclaimer.content}
          </div>
        </div>
      </div>
    </div>
  )
}