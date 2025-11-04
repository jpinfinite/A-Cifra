'use client'

import Image from 'next/image'

export function InfiniteBanner() {
  const whatsappNumber = '5521997759751'
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  return (
    <div className="my-8 mx-auto max-w-4xl">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 group"
      >
        <div className="relative w-full h-auto">
          <Image
            src="/infinite.jpg"
            alt="Banner Infinite"
            width={1200}
            height={300}
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </a>
    </div>
  )
}
