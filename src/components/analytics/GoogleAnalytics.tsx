'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { seoConfig } from '@/config/seo'

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && window.gtag) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      
      window.gtag('config', seoConfig.analytics.googleAnalyticsId, {
        page_path: url,
      })
    }
  }, [pathname, searchParams])

  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${seoConfig.analytics.googleAnalyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${seoConfig.analytics.googleAnalyticsId}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
    </>
  )
}
