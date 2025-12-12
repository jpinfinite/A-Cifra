'use client'

import { useEffect, useState } from 'react'

export function Comments() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="py-8 border-t border-gray-200 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Comentários</h2>
      <div className="min-h-[200px]">
        <script
          src="https://giscus.app/client.js"
          data-repo="jpinfinite/A-Cifra"
          data-repo-id="R_kgDONU8s_A"
          data-category="General"
          data-category-id="DIC_kwDONU8s_M4Ck0q6"
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-theme="light"
          data-lang="pt"
          crossOrigin="anonymous"
          async
        />
      </div>
    </section>
  )
}
