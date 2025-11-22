import { Header, Footer } from '@/components/layout'
import { SkipToContent } from '@/components/ui/SkipToContent'
import { CookieConsent } from '@/components/ui/CookieConsent'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <SkipToContent />
      <Header />
      <main id="main-content" className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </>
  )
}