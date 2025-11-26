'use client'

import { useState } from 'react'

import { Facebook, Twitter, Linkedin, Link as LinkIcon, MessageCircle } from 'lucide-react'

import { Button } from './Button'


interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
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

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-gray-700 mr-2">Compartilhar:</span>

      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        aria-label="Compartilhar no Facebook"
      >
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="h-4 w-4" />
        </a>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-blue-400 hover:text-blue-500 hover:bg-blue-50"
        aria-label="Compartilhar no Twitter"
      >
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="h-4 w-4" />
        </a>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
        aria-label="Compartilhar no LinkedIn"
      >
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
        aria-label="Compartilhar no WhatsApp"
      >
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={copyToClipboard}
        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
        aria-label="Copiar link"
      >
        <LinkIcon className="h-4 w-4" />
        {copied && <span className="ml-1 text-xs">Copiado!</span>}
      </Button>
    </div>
  )
}
