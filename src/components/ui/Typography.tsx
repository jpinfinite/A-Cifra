import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  gradient?: boolean
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, children, gradient = false, ...props }, ref) => {
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    
    const styles = {
      1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
      2: 'text-3xl md:text-4xl font-bold tracking-tight',
      3: 'text-2xl md:text-3xl font-semibold tracking-tight',
      4: 'text-xl md:text-2xl font-semibold tracking-tight',
      5: 'text-lg md:text-xl font-medium tracking-tight',
      6: 'text-base md:text-lg font-medium tracking-tight'
    }
    
    return (
      <Tag
        ref={ref}
        className={cn(
          'font-heading',
          styles[level],
          gradient && 'text-gradient',
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    )
  }
)

Heading.displayName = 'Heading'

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'muted' | 'accent'
  children: React.ReactNode
}

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ 
    className, 
    size = 'base', 
    weight = 'normal', 
    color = 'default', 
    children, 
    ...props 
  }, ref) => {
    const sizes = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    }
    
    const weights = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    }
    
    const colors = {
      default: 'text-gray-900',
      muted: 'text-gray-600',
      accent: 'text-brand-primary-blue'
    }
    
    return (
      <p
        ref={ref}
        className={cn(
          'leading-relaxed',
          sizes[size],
          weights[weight],
          colors[color],
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  }
)

Text.displayName = 'Text'

export { Heading, Text }