import { Metadata } from 'next'
import { MainLayout } from '@/components/layout'
import { AboutCifra } from '@/components/AboutCifra'
import { StructuredData } from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: 'Sobre Nós - A Cifra | Educação Cripto com Disciplina e Fundamentos',
  description: 'Conheça a Cifra: projeto independente dedicado à educação cripto baseada em experiência real, disciplina e soberania financeira. Sem promessas fáceis ou fórmulas mágicas.',
  keywords: ['sobre a cifra', 'educação cripto', 'disciplina financeira', 'soberania financeira', 'bitcoin dca', 'self custody', 'análise fundamentalista'],
  openGraph: {
    title: 'Sobre Nós - A Cifra | Educação Cripto com Disciplina',
    description: 'Conheça a Cifra: projeto independente dedicado à educação cripto baseada em experiência real, disciplina e soberania financeira.',
    type: 'website',
  },
}

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "A Cifra",
  "description": "Projeto independente dedicado à educação cripto baseada em experiência real, disciplina e soberania financeira",
  "url": "https://acifra.com/sobre",
  "foundingDate": "2018",
  "sameAs": [
    "https://instagram.com/cifras_coins",
    "https://twitter.com/acifra_btc",
    "https://github.com/a-cifra"
  ],
  "knowsAbout": [
    "Bitcoin",
    "Ethereum", 
    "Criptomoedas",
    "Self-custody",
    "Análise fundamentalista",
    "Gestão de risco",
    "Educação financeira"
  ]
}

export default function SobrePage() {
  return (
    <MainLayout>
      <StructuredData data={organizationStructuredData} />
      <AboutCifra />
    </MainLayout>
  )
}
