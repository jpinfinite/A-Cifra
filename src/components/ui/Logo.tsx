import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utils/cn'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'white' | 'footer'
  priority?: boolean
}

/**
 * Logo component com variantes para header e footer
 * - default/header: usa cabecalho.png
 * - white/footer: usa cifra-positivo.png
 */
export function Logo({ 
  className, 
  size = 'md', 
  variant = 'default',
  priority = false 
}: LogoProps) {
  const sizes = {
    sm: { width: 100, height: 33, class: 'h-8' },
    md: { width: 150, height: 50, class: 'h-12' },
    lg: { width: 200, height: 66, class: 'h-16' }
  }
  
  const sizeConfig = sizes[size]
  
  // Selecionar logo baseado na variante
  const logoSrc = variant === 'white' || variant === 'footer'
    ? '/images/logos/cifra-positivo.png'
    : '/images/logos/cabecalho.png'
  
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-blue focus-visible:ring-offset-2 rounded-lg transition-transform duration-200 hover:scale-105',
        className
      )}
      aria-label="A Cifra - Página inicial"
    >
      <Image 
        src={logoSrc}
        alt="A Cifra - Logo" 
        className={cn(
          'w-auto object-contain',
          sizeConfig.class
        )}
        width={sizeConfig.width}
        height={sizeConfig.height}
        priority={priority}
      />
    </Link>
  )
}