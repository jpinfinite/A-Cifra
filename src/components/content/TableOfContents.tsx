'use client'

import { useEffect, useState } from 'react'
import { TableOfContentsItem } from '@/types'

interface TableOfContentsProps {
  content: string
  title?: string
}

export function TableOfContents({ content, title = "Índice" }: TableOfContentsProps) {
  const [items, setItems] = useState<TableOfContentsItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extrair headings do conteúdo markdown
    const headingRegex = /^(#{2,4})\s+(.+)$/gm
    const headings: TableOfContentsItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const title = match[2].trim()
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')

      headings.push({
        id,
        title,
        level
      })
    }

    setItems(headings)
  }, [content])

  useEffect(() => {
    // Observar elementos visíveis na tela
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -35% 0%' }
    )

    // Observar todos os headings
    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 my-8 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        📋 {title}
      </h3>
      <nav className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`
              block w-full text-left px-3 py-2 rounded transition-colors
              ${item.level === 2 ? 'font-semibold' : 'font-normal'}
              ${item.level === 3 ? 'ml-4 text-sm' : ''}
              ${item.level === 4 ? 'ml-8 text-xs' : ''}
              ${activeId === item.id 
                ? 'bg-brand-primary-blue text-white' 
                : 'text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {item.title}
          </button>
        ))}
      </nav>
    </div>
  )
}