'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Article } from '@/types'
import { useMemo } from 'react'
import { addInlineLinks } from '@/utils/relatedArticles'

interface ArticleContentProps {
  content: string
  relatedArticles?: Article[]
}

export default function ArticleContent({ content, relatedArticles = [] }: ArticleContentProps) {
  // Adiciona links inline automaticamente
  const enhancedContent = useMemo(() => {
    if (relatedArticles.length > 0) {
      return addInlineLinks(content, relatedArticles)
    }
    return content
  }, [content, relatedArticles])

  return (
    <div className="prose prose-lg prose-headings:font-bold prose-a:text-brand-primary-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg max-w-none article-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Custom components for better styling
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-bold mt-6 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-bold mt-4 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4">
              {children}
            </blockquote>
          ),
          code: (props) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { inline, children, className, ...rest } = props as any
            return inline ? (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...rest}>
                {children}
              </code>
            ) : (
              <code className={`block bg-gray-100 p-4 rounded-lg overflow-x-auto ${className || ''}`} {...rest}>
                {children}
              </code>
            )
          },
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="rounded-lg my-6 w-full"
              loading="lazy"
              decoding="async"
            />
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
        }}
      >
        {enhancedContent}
      </ReactMarkdown>
    </div>
  )
}
