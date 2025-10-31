import { Metadata } from 'next'
import { MainLayout } from '@/components/layout'
import { ContactCifra } from '@/components/ContactCifra'
import { StructuredData } from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: 'Contatos | A Cifra - Canais Oficiais e Segurança',
  description: 'Entre em contato com A Cifra através de canais oficiais. Email, redes sociais e informações críticas de segurança. Transparência e comunicação educacional.',
  keywords: ['contatos a cifra', 'canais oficiais', 'segurança cripto', 'email contato', 'redes sociais', 'alerta golpes'],
  openGraph: {
    title: 'Contatos | A Cifra - Canais Oficiais e Segurança',
    description: 'Canais oficiais e informações de segurança para comunicação com A Cifra. Transparência e educação em primeiro lugar.',
    type: 'website',
  },
}

const contactStructuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contatos - A Cifra",
  "description": "Canais oficiais e informações importantes para comunicação com A Cifra",
  "url": "https://acifra.com/contatos",
  "mainEntity": {
    "@type": "Organization",
    "name": "A Cifra",
    "email": "cifraaessenciacoin@gmail.com",
    "sameAs": [
      "https://instagram.com/cifras_coins",
      "https://twitter.com/acifra_btc",
      "https://github.com/a-cifra"
    ]
  }
}

export default function ContatosPage() {
  return (
    <MainLayout>
      <StructuredData data={contactStructuredData} />
      <ContactCifra />
    </MainLayout>
  )
}