'use client'

import { useEffect, useState } from 'react'

import { List } from 'lucide-react'


interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
  className?: string
}

export function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extrai headings do conteúdo
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = content

    const headingElements = tempDiv.querySelectorAll('h2, h3')
    const extractedHeadings: Heading[] = []

    headingElements.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`
      if (!heading.id) {
        heading.id = id
      }

      extractedHeadings.push({
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1)),
      })
    })

    setHeadings(extractedHeadings)

    // Observer para destacar heading ativo
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -80% 0px' }
    )

    // Observa todos os headings
    headingElements.forEach((heading) => {
      if (heading.id) {
        const element = document.getElementById(heading.id)
        if (element) observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [content])

  if (headings.length === 0) return null

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <nav className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <List className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Índice
        </h2>
      </div>

      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
          >
            <button
              onClick={() => handleClick(heading.id)}
              className={`text-left w-full text-sm transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${activeId === heading.id
                  ? 'text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400'
                }`}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
