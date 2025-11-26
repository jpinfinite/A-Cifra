import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import ArticleContent from '@/components/ArticleContent'
import { ExchangeAffiliateLinks } from '@/components/content/ExchangeAffiliateLinks'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { ArticleFromFile } from '@/utils/articleLoader'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

// Gerar paths estáticos para todos os artigos em inglês
export async function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), 'content/articles/en')
  
  if (!fs.existsSync(articlesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(articlesDirectory)
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => ({
      slug: fileName.replace(/\.md$/, '')
    }))
}

async function getArticle(slug: string): Promise<ArticleFromFile | null> {
  try {
    const articlesDirectory = path.join(process.cwd(), 'content/articles/en')
    const filePath = path.join(articlesDirectory, `${slug}.md`)
    
    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      ...data,
      content,
      slug,
      language: 'en'
    } as ArticleFromFile
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading article:', error)
    }
    return null
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticle(params.slug)
  
  if (!article) {
    return {
      title: 'Article Not Found | A Cifra'
    }
  }

  return {
    title: article.seo?.metaTitle || `${article.title} | A Cifra`,
    description: article.seo?.metaDescription || article.excerpt,
    keywords: article.seo?.keywords || article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage?.src || '/images/default-og.jpg'],
      locale: 'en_US',
      alternateLocale: 'pt_BR'
    }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Language Toggle */}
        {article.alternateLanguages?.pt && (
          <div className="mb-6">
            <LanguageToggle 
              currentLang="en"
              alternateSlug={article.alternateLanguages.pt}
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-4">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {article.author && (
              <span>By {article.author.name}</span>
            )}
            {article.publishedAt && (
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="mb-8 relative w-full h-[400px]">
            <Image
              src={article.coverImage.src}
              alt={article.coverImage.alt}
              fill
              className="object-cover rounded-lg shadow-lg"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <ArticleContent content={article.content} />

        {/* Affiliate Links */}
        <div className="my-12">
          <ExchangeAffiliateLinks variant="default" />
        </div>
      </article>
    </main>
  )
}
