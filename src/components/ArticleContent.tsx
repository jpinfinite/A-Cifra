'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Article } from '@/types'
import { useMemo } from 'react'
import { addInlineLinks } from '@/utils/relatedArticles'
import { ExchangeAffiliateLinks } from '@/components/content/ExchangeAffiliateLinks'

interface ArticleContentProps {
  content: string
  relatedArticles?: Article[]
}

export default function ArticleContent({ content, relatedArticles = [] }: ArticleContentProps) {
  // Adiciona links inline automaticamente
  const enhancedContent = useMemo(() => {
    let processedContent = content
    
    if (relatedArticles.length > 0) {
      processedContent = addInlineLinks(processedContent, relatedArticles)
    }
    
    // Substitui <ExchangeAffiliateLinks /> por um marcador único
    processedContent = processedContent.replace(
      /<ExchangeAffiliateLinks\s*\/>/g,
      '___EXCHANGE_AFFILIATE_LINKS___'
    )
    
    return processedContent
  }, [content, relatedArticles])

  return (
    <div className="prose prose-xl max-w-none article-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Custom components for better styling and readability
          h1: ({ children }) => (
            <h1 className="text-5xl md:text-6xl font-extrabold mt-12 mb-6 leading-tight text-gray-900 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl md:text-4xl font-bold mt-16 mb-6 leading-snug text-gray-900 border-l-4 border-brand-primary-blue pl-6 bg-gradient-to-r from-blue-50 to-transparent py-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl md:text-3xl font-bold mt-10 mb-4 leading-snug text-gray-800">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-gray-800">
              {children}
            </h4>
          ),
          p: ({ children }) => {
            // Verifica se o parágrafo contém o marcador de afiliados
            const childrenString = String(children)
            if (childrenString.includes('___EXCHANGE_AFFILIATE_LINKS___')) {
              return <ExchangeAffiliateLinks />
            }
            
            return (
              <p className="mb-6 leading-relaxed text-lg text-gray-700 font-normal">
                {children}
              </p>
            )
          },
          ul: ({ children }) => (
            <ul className="mb-8 space-y-3 ml-6">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-8 space-y-3 ml-6 list-decimal list-outside">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-lg text-gray-700 leading-relaxed pl-2 marker:text-brand-primary-blue marker:font-bold">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-brand-gold bg-amber-50 pl-6 pr-6 py-4 my-8 italic text-gray-800 rounded-r-lg shadow-sm">
              <div className="flex items-start">
                <svg className="w-8 h-8 text-brand-gold mr-4 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div className="flex-1">{children}</div>
              </div>
            </blockquote>
          ),
          code: (props) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { inline, children, className, ...rest } = props as any
            return inline ? (
              <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-base font-semibold" {...rest}>
                {children}
              </code>
            ) : (
              <code className={`block bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto my-8 font-mono text-sm leading-relaxed shadow-lg ${className || ''}`} {...rest}>
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="my-8 overflow-hidden rounded-xl shadow-lg">
              {children}
            </pre>
          ),
          img: ({ src, alt }) => {
            // Usar img nativa para evitar problemas de hidratação com Next.js Image
            return (
              <figure className="my-10">
                <img
                  src={src || ''}
                  alt={alt || ''}
                  className="rounded-2xl w-full shadow-xl hover:shadow-2xl transition-shadow duration-300"
                  loading="lazy"
                  decoding="async"
                />
                {alt && (
                  <figcaption className="text-center text-sm text-gray-600 mt-3 italic">
                    {alt}
                  </figcaption>
                )}
              </figure>
            )
          },
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-brand-primary-blue font-semibold hover:text-brand-gold underline decoration-2 underline-offset-2 hover:decoration-brand-gold transition-colors duration-200"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800">
              {children}
            </em>
          ),
          hr: () => (
            <hr className="my-12 border-t-2 border-gray-200" />
          ),
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full divide-y divide-gray-200">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-brand-primary-blue text-white">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white divide-y divide-gray-200">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 text-sm text-gray-700">
              {children}
            </td>
          ),
        }}
      >
        {enhancedContent}
      </ReactMarkdown>
      
      <style jsx global>{`
        .article-content {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.8;
          color: #1f2937;
        }
        
        .article-content p {
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
          line-height: 1.8;
        }
        
        .article-content strong {
          font-weight: 700;
          color: #111827;
        }
        
        .article-content a {
          transition: all 0.2s ease;
        }
        
        .article-content a:hover {
          transform: translateY(-1px);
        }
        
        .article-content ul li::marker {
          color: #155C8B;
          font-weight: bold;
        }
        
        .article-content ol li::marker {
          color: #155C8B;
          font-weight: bold;
        }
        
        .article-content ol li,
        .article-content ul li {
          background: transparent !important;
        }
        
        .article-content ol li code,
        .article-content ul li code {
          background: #dbeafe !important;
          padding: 0.125rem 0.5rem !important;
        }
      `}</style>
    </div>
  )
}
