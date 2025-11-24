'use client'

import { useState } from 'react'
import { FAQProps } from '@/types'

export function FAQ({ items, title = "Perguntas Frequentes" }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        ❓ {title}
      </h2>
      <div className="space-y-4 max-w-4xl mx-auto">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary-blue"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                <span className="text-2xl text-brand-primary-blue flex-shrink-0">
                  {openItems.has(index) ? '−' : '+'}
                </span>
              </div>
            </button>
            {openItems.has(index) && (
              <div className="px-6 py-4 bg-white border-t border-gray-200">
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}