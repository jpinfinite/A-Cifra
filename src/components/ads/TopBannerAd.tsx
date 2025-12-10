'use client'

import { AdSense } from './AdSense'

interface TopBannerAdProps {
  className?: string
}

export function TopBannerAd({ className = '' }: TopBannerAdProps) {
  return (
    <div className={`w-full bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 flex justify-center items-center overflow-hidden ${className}`}>
       <div className="container max-w-7xl mx-auto px-4 py-4 text-center">
         <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-medium">Publicidade</div>
         <div className="min-h-[100px] flex justify-center items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
           <AdSense
              adSlot="5064156814" // A Cifra - Header Display
              adFormat="horizontal"
              fullWidthResponsive={true}
              className="w-full flex justify-center items-center"
           />
         </div>
       </div>
    </div>
  )
}
