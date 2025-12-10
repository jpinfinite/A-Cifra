import { Header, Footer } from '@/components/layout'
import { SkipToContent } from '@/components/ui/SkipToContent'
import { CookieConsent } from '@/components/ui/CookieConsent'
import { TopBannerAd } from '@/components/ads/TopBannerAd'

interface MainLayoutProps {
  children: React.ReactNode
  dictionary?: any
  locale?: 'pt-BR' | 'en' | 'es'
}

export function MainLayout({ children, dictionary, locale }: MainLayoutProps) {
  return (
    <>
      <SkipToContent />
      <Header dictionary={dictionary} locale={locale} />
      <main id="main-content" className="flex-1 pt-16">
        <TopBannerAd />
        {children}
      </main>
      <Footer dictionary={dictionary} />
      <CookieConsent />
    </>
  )
}
