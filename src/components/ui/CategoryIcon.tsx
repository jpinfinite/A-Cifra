import Image from 'next/image'

interface CategoryIconProps {
  category: string
  className?: string
}

const iconMapping: Record<string, string> = {
  bitcoin: '/images/icons/bitcoin-3d.png',
  ethereum: '/images/icons/ethereum-3d.png',
  altcoins: '/images/icons/altcoins-3d.png',
  defi: '/images/icons/defi-3d.png',
  nfts: '/images/icons/nfts-3d.png',
  seguranca: '/images/icons/security-3d.png',
  analises: '/images/icons/analysis-3d.png',
  educacao: '/images/icons/education-3d.png',
  // Fallbacks para categorias que possam surgir
  news: '/images/icons/analysis-3d.png',
  default: '/images/icons/bitcoin-3d.png'
}

export function CategoryIcon({ category, className = "w-12 h-12" }: CategoryIconProps) {
  const iconSrc = iconMapping[category.toLowerCase()] || iconMapping.default

  return (
    <div className={`${className} relative`}>
      <Image
        src={iconSrc}
        alt={`Ícone da categoria ${category}`}
        fill
        className="object-contain drop-shadow-md transition-transform duration-300 hover:scale-110"
        sizes="(max-width: 768px) 48px, 64px"
      />
    </div>
  )
}
