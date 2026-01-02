'use client'

import { useEffect, useRef } from 'react'

export function Comments() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'jpinfinite/A-Cifra')
    script.setAttribute('data-repo-id', 'R_kgDONU8s_A')
    script.setAttribute('data-category', 'General')
    script.setAttribute('data-category-id', 'DIC_kwDONU8s_M4Ck0q6')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', 'light')
    script.setAttribute('data-lang', 'pt')
    script.crossOrigin = 'anonymous'
    script.async = true

    ref.current.appendChild(script)
  }, [])

  return (
    <section className="py-8 border-t border-gray-200 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Comentários</h2>
      <div ref={ref} className="min-h-[200px]" />
    </section>
  )
}
