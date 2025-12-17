import Link from 'next/link'
import { Twitter, Instagram } from 'lucide-react'
import { Text } from '@/components/ui'

interface FooterProps {
  dictionary?: any
}

export function Footer({ dictionary }: FooterProps) {
  const navDict = dictionary?.nav || {}

  const footerLinks = {
    categorias: [
      { label: 'Bitcoin', href: '/categoria/bitcoin' },
      { label: 'Altcoins', href: '/categoria/altcoins' },
      { label: 'DeFi', href: '/categoria/defi' },
      { label: 'NFTs', href: '/categoria/nfts' },
    ],
    recursos: [
      { label: navDict.analysis || 'Análises', href: '/categoria/analises' },
      { label: navDict.education || 'Educação', href: '/categoria/educacao' },
      { label: 'Glossário', href: '/glossario' },
      { label: 'Calculadoras', href: '/ferramentas' },
    ],
    empresa: [
      { label: navDict.about || 'Sobre Nós', href: '/sobre' },
      { label: navDict.contact || 'Contato', href: '/contatos' },
      { label: 'Política de Privacidade', href: '/privacidade' },
      { label: 'Termos de Uso', href: '/termos' },
    ],
    parceiros: [
      { label: 'Detailing Prime', href: 'https://detailingprime.com.br', external: true },
      { label: 'Cronixverso', href: 'https://www.cronixverso.com.br', external: true },
    ]
  }

  const socialLinks = [
    {
      name: 'X (Twitter)',
      href: 'https://x.com/acifra_btc',
      icon: Twitter,
      ariaLabel: 'Seguir no X (Twitter)'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/cifras_coins',
      icon: Instagram,
      ariaLabel: 'Seguir no Instagram'
    }
  ]
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-dark-blue text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark-blue rounded-lg transition-transform duration-200 hover:scale-105"
              aria-label="A Cifra - Página inicial"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                a cifra
              </h2>
            </Link>
            <Text className="mt-4 text-gray-300 max-w-xs">
              Seu guia completo sobre criptomoedas, blockchain e investimentos digitais.
              Análises, notícias e educação financeira.
            </Text>

            {/* Contact Email */}
            <div className="mt-6 flex items-center gap-2 text-gray-300">
              <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a
                href="mailto:cifraaessenciacoin@gmail.com"
                className="hover:text-brand-gold transition-colors duration-200 text-sm"
              >
                cifraaessenciacoin@gmail.com
              </a>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-brand-gold transition-colors duration-200 p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark-blue min-h-touch min-w-touch flex items-center justify-center"
                    aria-label={social.ariaLabel}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-gold">
              Categorias
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.categorias.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark-blue rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-gold">
              Recursos
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark-blue rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-gold">
              Empresa
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark-blue rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Parceiros */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-gold">
              Parceiros
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.parceiros.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark-blue rounded inline-flex items-center gap-1"
                  >
                    {link.label}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-brand-medium-blue pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <Text className="text-gray-400 text-sm">
              © {currentYear} A Cifra. Todos os direitos reservados.
            </Text>
            <Text className="text-gray-400 text-sm flex items-center gap-1">
              Cifra a comunidade crypto brasileira
            </Text>
          </div>
        </div>
      </div>
    </footer>
  )
}
