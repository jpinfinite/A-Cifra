'use client'

import { useState } from 'react'

import { Facebook, Twitter, Linkedin, Link2, MessageCircle } from 'lucide-react'


interface ShareButtonsProps {
  url: string
  title: string
  className?: string
}

export function ShareButtons({ url, title, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to copy:', err)
      }
    }
  }

  const shareButtons = [
    { name: 'Twitter', icon: Twitter, url: shareLinks.twitter, color: 'hover:bg-blue-500' },
    { name: 'Facebook', icon: Facebook, url: shareLinks.facebook, color: 'hover:bg-blue-600' },
    { name: 'LinkedIn', icon: Linkedin, url: shareLinks.linkedin, color: 'hover:bg-blue-700' },
    { name: 'WhatsApp', icon: MessageCircle, url: shareLinks.whatsapp, color: 'hover:bg-green-500' },
  ]

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Compartilhar:
      </p>

      <div className="flex flex-wrap gap-2">
        {shareButtons.map((button) => {
          const Icon = button.icon
          return (
            <a
              key={button.name}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all hover:text-white ${button.color}`}
              aria-label={`Compartilhar no ${button.name}`}
            >
              <Icon className="w-5 h-5" />
            </a>
          )
        })}

        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-400 hover:text-white"
          aria-label="Copiar link"
        >
          <Link2 className="w-5 h-5" />
        </button>
      </div>

      {copied && (
        <p className="text-xs text-green-600 dark:text-green-400">
          Link copiado!
        </p>
      )}
    </div>
  )
}
