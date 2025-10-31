'use client'

import { useEffect, useState } from 'react'
import { TableOfContentsItem } from '@/types'

interface TableOfContentsProps {
  contentId?: string
  className?: string
}

export const TableOfContents = ({ 
  contentId = 'article-content',
  className = ''
}: TableOfContentsProps) => {
  const [items, setItems] = useState<TableOfContentsItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extrair headings do conteúdo
    const content = document.getElementById(contentId)
    if (!content) return

    const headings = content.querySelectorAll('h2, h3, h4')
    const tocItems: TableOfContentsItem[] = []

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1))
      const text = heading.textContent || ''
      const id = heading.id || `heading-${index}`
      
      // Adicionar ID se não existir
      if (!heading.id) {
        heading.id = id
      }

      tocItems.push({
        id,
        title: text,
        level
      })
    })

    setItems(tocItems)

    // Observador de interseção para destacar item ativo
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px'
      }
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [contentId])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (items.length === 0) return null

  return (
    <nav 
      className={className}
      aria-label="Índice do artigo"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 40, 59, 0.05) 0%, rgba(21, 92, 139, 0.05) 100%)',
        borderRadius: 12,
        padding: '24px',
        border: '2px solid rgba(21, 92, 139, 0.2)',
        position: 'sticky',
        top: 100,
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto'
      }}
    >
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#00283B',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span aria-hidden="true">📑</span>
        Índice
      </h2>
      
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0
      }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              marginLeft: `${(item.level - 2) * 16}px`,
              marginBottom: '8px'
            }}
          >
            <button
              onClick={() => handleClick(item.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 12px',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: 6,
                fontSize: item.level === 2 ? '0.95rem' : '0.875rem',
                fontWeight: item.level === 2 ? 600 : 400,
                color: activeId === item.id ? '#155C8B' : '#4a5568',
                backgroundColor: activeId === item.id ? 'rgba(21, 92, 139, 0.1)' : 'transparent',
                borderLeft: activeId === item.id ? '3px solid #155C8B' : '3px solid transparent',
                transition: 'all 0.2s ease',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                if (activeId !== item.id) {
                  e.currentTarget.style.backgroundColor = 'rgba(21, 92, 139, 0.05)'
                  e.currentTarget.style.color = '#155C8B'
                }
              }}
              onMouseLeave={(e) => {
                if (activeId !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#4a5568'
                }
              }}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>

      <style jsx>{`
        nav::-webkit-scrollbar {
          width: 6px;
        }
        nav::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }
        nav::-webkit-scrollbar-thumb {
          background: rgba(21, 92, 139, 0.3);
          border-radius: 3px;
        }
        nav::-webkit-scrollbar-thumb:hover {
          background: rgba(21, 92, 139, 0.5);
        }
      `}</style>
    </nav>
  )
}
