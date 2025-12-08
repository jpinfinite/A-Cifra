'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Menu, X, Search, ChevronDown } from 'lucide-react'

import { Button, Logo, LanguageSwitcher } from '@/components/ui'
import { cn } from '@/utils/cn'
import { NavigationItem } from '@/types'


// Navegação otimizada com novas categorias
interface HeaderProps {
  dictionary?: any
  locale?: string
}

export function Header({ dictionary, locale = 'pt-BR' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navDict = dictionary?.nav || {}

  // Create navigation based on locale/dictionary
  const navigation: NavigationItem[] = [
    { label: navDict.home || 'Início', href: locale === 'pt-BR' ? '/' : (locale === 'en' ? '/en' : '/es') },
    {
      label: 'Tokens', // TODO: Add to dictionary
      href: '#',
      children: [
        { label: 'Bitcoin', href: '/categoria/bitcoin' },
        { label: 'Ethereum', href: '/categoria/ethereum' },
        { label: 'Altcoins', href: '/categoria/altcoins' },
        { label: 'DeFi', href: '/categoria/defi' },
        { label: 'NFTs', href: '/categoria/nfts' },
        { label: 'Memecoin', href: '/categoria/memecoin' },
      ]
    },
    { label: navDict.articles || 'Artigos', href: locale === 'pt-BR' ? '/artigos' : '/artigos' },
    { label: navDict.security || 'Segurança', href: '/categoria/seguranca' },
    { label: navDict.analysis || 'Análises', href: '/categoria/analises' },
    { label: navDict.education || 'Educação', href: '/categoria/educacao' },
    { label: navDict.about || 'Sobre Nós', href: '/sobre' },
    { label: navDict.contact || 'Contatos', href: '/contatos' },
  ]
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  // Otimização do scroll handler com throttle
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 10)
    }

    const throttledHandleScroll = () => {
      if (timeoutId) return
      timeoutId = setTimeout(handleScroll, 16) // ~60fps
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false)
    setIsSearchOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  // Fechar menu ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
        setIsSearchOpen(false)
        setOpenDropdown(null)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null)
    }

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdown])

  // Callbacks otimizados
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev)
  }, [])

  const toggleDropdown = useCallback((label: string) => {
    setOpenDropdown(prev => prev === label ? null : label)
  }, [])

  const closeDropdown = useCallback(() => {
    setOpenDropdown(null)
  }, [])

  // Verificar se link está ativo
  const isActive = useCallback((href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href))
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
            : 'bg-white border-b border-gray-50'
        )}
      >
        {/* Top Bar com Email */}
        <div className="bg-brand-dark-blue text-white py-2 hidden md:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href="mailto:cifraaessenciacoin@gmail.com"
                  className="hover:text-brand-gold transition-colors duration-200"
                >
                  cifraaessenciacoin@gmail.com
                </a>
              </div>
              <div className="text-gray-300">
                Seu guia completo sobre criptomoedas
              </div>
            </div>
          </div>
        </div>

        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Navegação principal">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center group"
                aria-label="A Cifra - Página inicial"
              >
                <Logo size="md" priority />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-1">
                {navigation.map((item) => (
                  <div key={item.href} className="relative">
                    {item.children ? (
                      // Dropdown menu
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleDropdown(item.label)
                          }}
                          className={cn(
                            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                            'min-h-touch min-w-touch flex items-center justify-center space-x-1',
                            'hover:bg-brand-off-white hover:text-brand-primary-blue',
                            'focus:outline-none focus:ring-2 focus:ring-brand-primary-blue focus:ring-offset-2',
                            openDropdown === item.label
                              ? 'bg-brand-primary-blue text-white shadow-md'
                              : 'text-brand-dark-blue'
                          )}
                          aria-expanded={openDropdown === item.label}
                          aria-haspopup="true"
                        >
                          <span>{item.label}</span>
                          <ChevronDown className={cn(
                            'h-4 w-4 transition-transform duration-200',
                            openDropdown === item.label ? 'rotate-180' : ''
                          )} />
                        </button>

                        {/* Dropdown content */}
                        {openDropdown === item.label && (
                          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={closeDropdown}
                                className={cn(
                                  'block px-4 py-2 text-sm font-medium transition-all duration-200',
                                  'hover:bg-brand-off-white hover:text-brand-primary-blue',
                                  'focus:outline-none focus:bg-brand-off-white focus:text-brand-primary-blue',
                                  isActive(child.href)
                                    ? 'bg-brand-primary-blue text-white'
                                    : 'text-brand-dark-blue'
                                )}
                                aria-current={isActive(child.href) ? 'page' : undefined}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular link
                      <Link
                        href={item.href}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                          'min-h-touch min-w-touch flex items-center justify-center',
                          'hover:bg-brand-off-white hover:text-brand-primary-blue',
                          'focus:outline-none focus:ring-2 focus:ring-brand-primary-blue focus:ring-offset-2',
                          isActive(item.href)
                            ? 'bg-brand-primary-blue text-white shadow-md'
                            : 'text-brand-dark-blue'
                        )}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Search, Language Switcher and Mobile menu button */}
            <div className="flex items-center space-x-2">
              {/* Language Switcher */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center space-x-2"
                onClick={toggleSearch}
                aria-label="Pesquisar artigos"
                aria-expanded={isSearchOpen}
              >
                <Search className="h-4 w-4" />
                <span className="hidden md:inline">Pesquisar</span>
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="py-4 border-t border-gray-100 animate-fade-in">
              <div className="max-w-2xl mx-auto">
                <form
                  className="relative"
                  role="search"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="search"
                    placeholder="Pesquisar artigos, tópicos..."
                    className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-blue focus:border-transparent transition-all duration-200"
                    autoFocus
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label="Fechar pesquisa"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Mobile Navigation */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed top-16 left-0 right-0 z-40 lg:hidden transition-all duration-300 ease-in-out',
          'bg-white border-b border-gray-200 shadow-lg',
          isMenuOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        )}
      >
        <nav className="px-4 py-4" aria-label="Menu mobile">
          <div className="space-y-1">
            {navigation.map((item) => (
              <div key={item.href}>
                {item.children ? (
                  // Mobile dropdown
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium',
                        'transition-all duration-200 min-h-touch',
                        'hover:bg-brand-off-white hover:text-brand-primary-blue',
                        'focus:outline-none focus:ring-2 focus:ring-brand-primary-blue focus:ring-offset-2',
                        openDropdown === item.label
                          ? 'bg-brand-primary-blue text-white shadow-md'
                          : 'text-brand-dark-blue'
                      )}
                      aria-expanded={openDropdown === item.label}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        openDropdown === item.label ? 'rotate-180' : ''
                      )} />
                    </button>

                    {/* Mobile submenu */}
                    {openDropdown === item.label && (
                      <div className="mt-1 ml-4 space-y-1 animate-fade-in">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'block px-4 py-2 rounded-lg text-sm font-medium',
                              'transition-all duration-200 min-h-touch',
                              'hover:bg-brand-off-white hover:text-brand-primary-blue',
                              'focus:outline-none focus:ring-2 focus:ring-brand-primary-blue focus:ring-offset-2',
                              isActive(child.href)
                                ? 'bg-brand-primary-blue text-white shadow-md'
                                : 'text-brand-dark-blue'
                            )}
                            aria-current={isActive(child.href) ? 'page' : undefined}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular mobile link
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium',
                      'transition-all duration-200 min-h-touch',
                      'hover:bg-brand-off-white hover:text-brand-primary-blue',
                      'focus:outline-none focus:ring-2 focus:ring-brand-primary-blue focus:ring-offset-2',
                      isActive(item.href)
                        ? 'bg-brand-primary-blue text-white shadow-md'
                        : 'text-brand-dark-blue'
                    )}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    <span>{item.label}</span>
                    {isActive(item.href) && (
                      <ChevronDown className="h-4 w-4 rotate-180" />
                    )}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Language Switcher and Search */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="md:hidden">
                <LanguageSwitcher />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start items-center space-x-2"
                onClick={toggleSearch}
                aria-label="Pesquisar artigos"
              >
                <Search className="h-4 w-4" />
                <span>Pesquisar artigos</span>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
