interface CategoryIconProps {
  category: string
  className?: string
}

export function CategoryIcon({ category, className = "w-12 h-12" }: CategoryIconProps) {
  const icons = {
    bitcoin: (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" fill="#F7931A" stroke="#E6A000" strokeWidth="2"/>
        <path d="M18 14h8c3 0 5 2 5 4.5 0 1.5-1 3-2.5 3.5 2 0.5 3.5 2 3.5 4 0 3-2.5 5-5.5 5h-8.5v-17zm4 2v5h4c1.5 0 2.5-1 2.5-2.5s-1-2.5-2.5-2.5h-4zm0 7v6h4.5c2 0 3.5-1 3.5-3s-1.5-3-3.5-3h-4.5z" fill="white"/>
        <path d="M20 10v4m4-4v4m-4 20v4m4-4v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    altcoins: (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="10" fill="#FFD700" stroke="#E6A000" strokeWidth="1"/>
        <text x="16" y="21" textAnchor="middle" fill="#333" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold">M</text>
        <circle cx="32" cy="16" r="10" fill="#6B7280" stroke="#4B5563" strokeWidth="1"/>
        <polygon points="32,10 28,18 32,20 36,18" fill="white"/>
        <polygon points="32,22 28,20 32,26 36,20" fill="white" opacity="0.7"/>
        <circle cx="24" cy="32" r="10" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1"/>
        <text x="24" y="37" textAnchor="middle" fill="#374151" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold">Ł</text>
      </svg>
    ),
    defi: (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke="#9CA3AF" strokeWidth="2"/>
        <rect x="18" y="18" width="12" height="12" rx="2" fill="#6366F1"/>
        <circle cx="24" cy="22" r="2" fill="white"/>
        <path d="M20 28c0-2 2-3 4-3s4 1 4 3" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="24" cy="4" r="6" fill="#E1A441" stroke="#E6A000" strokeWidth="1"/>
        <text x="24" y="8" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="bold">%</text>
        <circle cx="44" cy="24" r="6" fill="#E1A441" stroke="#E6A000" strokeWidth="1"/>
        <text x="44" y="28" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="bold">₿</text>
        <circle cx="24" cy="44" r="6" fill="#E1A441" stroke="#E6A000" strokeWidth="1"/>
        <text x="24" y="48" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="bold">$</text>
        <circle cx="4" cy="24" r="6" fill="#E1A441" stroke="#E6A000" strokeWidth="1"/>
        <polygon points="4,20 2,26 6,26" fill="white"/>
        <line x1="24" y1="10" x2="24" y2="18" stroke="#9CA3AF" strokeWidth="2"/>
        <line x1="38" y1="24" x2="30" y2="24" stroke="#9CA3AF" strokeWidth="2"/>
        <line x1="24" y1="38" x2="24" y2="30" stroke="#9CA3AF" strokeWidth="2"/>
        <line x1="10" y1="24" x2="18" y2="24" stroke="#9CA3AF" strokeWidth="2"/>
      </svg>
    ),
    nfts: (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2"/>
        <polygon points="24,8 32,13 32,23 24,28 16,23 16,13" fill="#00283B" stroke="#6366F1" strokeWidth="1"/>
        <text x="24" y="20" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="bold">NFT</text>
        <rect x="8" y="4" width="6" height="6" fill="#3B82F6" transform="rotate(45 11 7)"/>
        <rect x="34" y="4" width="6" height="6" fill="#8B5CF6" transform="rotate(45 37 7)"/>
        <rect x="8" y="38" width="6" height="6" fill="#10B981" transform="rotate(45 11 41)"/>
        <rect x="34" y="38" width="6" height="6" fill="#F59E0B" transform="rotate(45 37 41)"/>
        <line x1="16" y1="13" x2="11" y2="7" stroke="#9CA3AF" strokeWidth="1" opacity="0.5"/>
        <line x1="32" y1="13" x2="37" y2="7" stroke="#9CA3AF" strokeWidth="1" opacity="0.5"/>
        <line x1="16" y1="23" x2="11" y2="41" stroke="#9CA3AF" strokeWidth="1" opacity="0.5"/>
        <line x1="32" y1="23" x2="37" y2="41" stroke="#9CA3AF" strokeWidth="1" opacity="0.5"/>
        <circle cx="6" cy="24" r="2" fill="#10B981"/>
        <circle cx="42" cy="24" r="2" fill="#F59E0B"/>
        <circle cx="24" cy="6" r="2" fill="#EF4444"/>
        <circle cx="24" cy="42" r="2" fill="#8B5CF6"/>
      </svg>
    ),
    ethereum: (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" fill="#627EEA" stroke="#4C63D2" strokeWidth="2"/>
        <path d="M24 8L14 16L24 24L34 16L24 8Z" fill="white"/>
        <path d="M14 16L24 24V40L14 32V16Z" fill="white" opacity="0.8"/>
        <path d="M34 16L24 24V40L34 32V16Z" fill="white" opacity="0.6"/>
        <path d="M24 24L14 32L24 40L34 32L24 24Z" fill="white"/>
      </svg>
    ),
    seguranca: (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L8 12V24C8 32 14 39 24 42C34 39 40 32 40 24V12L24 4Z" fill="#10B981" stroke="#059669" strokeWidth="2"/>
        <path d="M24 14V22L30 26L24 30V22L18 18L24 14Z" fill="white" opacity="0.9"/>
        <path d="M24 22L18 26L24 30V22Z" fill="white" opacity="0.7"/>
        <circle cx="24" cy="20" r="3" fill="#F59E0B"/>
        <path d="M24 17L22 19L24 21L26 19L24 17Z" fill="white"/>
      </svg>
    ),
    analises: (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="32" width="6" height="10" fill="#EF4444" rx="1"/>
        <rect x="15" y="26" width="6" height="16" fill="#F59E0B" rx="1"/>
        <rect x="24" y="20" width="6" height="22" fill="#10B981" rx="1"/>
        <rect x="33" y="12" width="6" height="30" fill="#3B82F6" rx="1"/>
        <path d="M9 35 L18 29 L27 23 L36 15" stroke="#374151" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="9" cy="35" r="3" fill="#F59E0B"/>
        <circle cx="18" cy="29" r="3" fill="#10B981"/>
        <circle cx="27" cy="23" r="3" fill="#10B981"/>
        <circle cx="36" cy="15" r="3" fill="#3B82F6"/>
        <line x1="4" y1="44" x2="44" y2="44" stroke="#9CA3AF" strokeWidth="2"/>
      </svg>
    ),
    educacao: (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 20 L24 12 L40 20 L24 28 Z" fill="#374151"/>
        <path d="M8 20 L24 12 L40 20 L24 28 Z" fill="#155C8B" opacity="0.8"/>
        <ellipse cx="24" cy="20" rx="16" ry="4" fill="#1F2937" opacity="0.3"/>
        <circle cx="32" cy="16" r="2" fill="#F59E0B"/>
        <path d="M32 18 Q34 20 32 22 Q30 20 32 18" fill="#F59E0B"/>
        <rect x="16" y="28" width="16" height="12" rx="2" fill="#155C8B" stroke="#4F46E5" strokeWidth="1"/>
        <rect x="18" y="30" width="12" height="8" rx="1" fill="white"/>
        <circle cx="24" cy="34" r="3" fill="#10B981"/>
        <polygon points="22.5,32 22.5,36 26,34" fill="white"/>
        <rect x="8" y="42" width="32" height="3" rx="1.5" fill="#9CA3AF"/>
      </svg>
    )
  }

  return icons[category as keyof typeof icons] || icons.bitcoin
}