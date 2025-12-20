'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'


import { ExchangeAffiliateLinks } from '@/components/content/ExchangeAffiliateLinks'
import { AdSlot } from '@/components/ads/AdSlot'
import { ArticleImage } from '@/components/content/ArticleImage'

interface ArticleBlock {
  type: 'text' | 'ad'
  content?: string
  slot?: string
}

interface ArticleContentProps {
  content: string
  blocks?: ArticleBlock[]

}

const markdownComponents = {
  // Custom components for better styling and readability
  h1: ({ children }: any) => (
    <h1 className="text-5xl md:text-6xl font-extrabold mt-12 mb-6 leading-tight text-gray-900 tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-3xl md:text-4xl font-bold mt-16 mb-6 leading-snug text-gray-900 border-l-4 border-brand-primary-blue pl-6 bg-gradient-to-r from-blue-50 to-transparent py-4">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-2xl md:text-3xl font-bold mt-10 mb-4 leading-snug text-gray-800">
      {children}
    </h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-gray-800">
      {children}
    </h4>
  ),
  p: ({ children }: any) => (
    <p className="mb-6 leading-relaxed text-lg text-gray-700 font-normal">
      {children}
    </p>
  ),
  ul: ({ children }: any) => (
    <ul className="mb-8 space-y-3 ml-6">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="mb-8 space-y-3 ml-6 list-decimal list-outside">
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li className="text-lg text-gray-700 leading-relaxed pl-2 marker:text-brand-primary-blue marker:font-bold">
      {children}
    </li>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-brand-gold bg-amber-50 pl-6 pr-6 py-4 my-8 italic text-gray-800 rounded-r-lg shadow-sm">
      <div className="flex items-start">
        <svg className="w-8 text-brand-gold mr-4 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <div className="flex-1">{children}</div>
      </div>
    </blockquote>
  ),
  code: ({ inline, children }: { inline?: boolean; children?: React.ReactNode }) => {
    return inline ? (
      <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-base font-semibold">
        {children}
      </code>
    ) : (
      <code className="block bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto my-8 font-mono text-sm leading-relaxed shadow-lg">
        {children}
      </code>
    )
  },
  pre: ({ children }: any) => (
    <pre className="my-8 overflow-hidden rounded-xl shadow-lg">
      {children}
    </pre>
  ),
  img: (props: any) => <ArticleImage {...props} />,
  a: ({ href, children }: any) => (
    <a
      href={href}
      className="text-brand-primary-blue font-semibold hover:text-brand-gold underline decoration-2 underline-offset-2 hover:decoration-brand-gold transition-colors duration-200"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }: any) => (
    <strong className="font-bold text-gray-900">
      {children}
    </strong>
  ),
  em: ({ children }: any) => (
    <em className="italic text-gray-800">
      {children}
    </em>
  ),
  hr: () => (
    <hr className="my-12 border-t-2 border-gray-200" />
  ),
  table: ({ children }: any) => (
    <div className="my-8 overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="bg-brand-primary-blue text-white">
      {children}
    </thead>
  ),
  tbody: ({ children }: any) => (
    <tbody className="bg-white divide-y divide-gray-200">
      {children}
    </tbody>
  ),
  tr: ({ children }: any) => (
    <tr className="hover:bg-gray-50 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }: any) => (
    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="px-6 py-4 text-sm text-gray-700">
      {children}
    </td>
  ),
}

export default function ArticleContent({ content, blocks }: ArticleContentProps) {
  // Se houver blocos estruturados (JSON), renderiza diretamente
  if (blocks && blocks.length > 0) {
    return (
      <div className="prose prose-xl max-w-none article-content">
        {blocks.map((block, index) => {
          if (block.type === 'ad') {
            return <AdSlot key={index} slot={block.slot || '2401624018'} format="rectangle" />
          }
          if (block.type === 'text' && block.content) {
            return (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
              >
                {block.content}
              </ReactMarkdown>
            )
          }
          return null
        })}
        {/* Affiliate Links at the end */}
        <ExchangeAffiliateLinks />
        <AdSlot slot="2742082553" format="autorelaxed" />
        <style jsx global>{`
          .article-content {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.8;
            color: #1f2937;
          }
          /* Additional Global Styles can be here */
        `}</style>
      </div>
    )
  }

  // Fallback para lógica Markdown tradicional
  let processedContent = content

  // Substitui componentes customizados por placeholders HTML
  processedContent = processedContent
    .replace(/<InlineAffiliateCTA\s+([^>]+)\/>/g, '<div data-component="InlineAffiliateCTA" $1></div>')
    .replace(/<UrgencyCTA\s+([^>]+)\/>/g, '<div data-component="UrgencyCTA" $1></div>')
    .replace(/<ExchangeAffiliateLinks\s+([^>]+)\/>/g, '<div data-component="ExchangeAffiliateLinks" $1></div>')

  // Divide o conteúdo em partes baseadas em cabeçalhos (H2, H3 ou Bold no início da linha)
  const sectionRegex = /(?=\n(?:##|###|\*\*) )/
  const sections = processedContent.split(sectionRegex)
  const totalSections = sections.length

  let parts = {
    firstPart: '',
    secondPart: '',
    thirdPart: '',
    fourthPart: ''
  }

  if (totalSections <= 5) {
    // Conteúdo curto/médio - apenas 1 anúncio no meio
    parts = {
      firstPart: sections.slice(0, Math.ceil(totalSections / 2)).join(''),
      secondPart: sections.slice(Math.ceil(totalSections / 2)).join(''),
      thirdPart: '',
      fourthPart: ''
    }
  } else if (totalSections <= 12) {
    // Conteúdo longo - 2 anúncios (40% e 80% do conteúdo)
    const firstBreak = Math.floor(totalSections * 0.4)
    const secondBreak = Math.floor(totalSections * 0.8)

    parts = {
      firstPart: sections.slice(0, firstBreak).join(''),
      secondPart: sections.slice(firstBreak, secondBreak).join(''),
      thirdPart: sections.slice(secondBreak).join(''),
      fourthPart: ''
    }
  } else {
    // Conteúdo muito longo (>12 seções) - 3 anúncios (distribuídos uniformemente)
    const break1 = Math.floor(totalSections * 0.25)
    const break2 = Math.floor(totalSections * 0.5)
    const break3 = Math.floor(totalSections * 0.75)

    parts = {
      firstPart: sections.slice(0, break1).join(''),
      secondPart: sections.slice(break1, break2).join(''),
      thirdPart: sections.slice(break2, break3).join(''),
      fourthPart: sections.slice(break3).join('')
    }
  }

  const { firstPart, secondPart, thirdPart, fourthPart } = parts

  return (
    <div className="prose prose-xl max-w-none article-content">
      {/* Primeira parte do conteúdo */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}
      >
        {firstPart}
      </ReactMarkdown>

      {/* Anúncio In-Article 1 */}
      <AdSlot slot="2401624018" format="rectangle" />

      {/* Segunda parte */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}
      >
        {secondPart}
      </ReactMarkdown>

      {/* Links de Afiliados */}
      <ExchangeAffiliateLinks />

      {/* Anúncio In-Article 2 */}
      {thirdPart && <AdSlot slot="3416033223" format="rectangle" />}

      {/* Terceira parte */}
      {thirdPart && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={markdownComponents}
        >
          {thirdPart}
        </ReactMarkdown>
      )}

      {/* Anúncio In-Article 3 (apenas textos muito longos) */}
      {fourthPart && <AdSlot slot="5028497790" format="rectangle" />}

      {/* Quarta parte (final) */}
      {fourthPart && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={markdownComponents}
        >
          {fourthPart}
        </ReactMarkdown>
      )}

      {/* Anúncio Multiplex - Final do artigo */}
      <AdSlot slot="2742082553" format="autorelaxed" />

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
