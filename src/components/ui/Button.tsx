import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, asChild = false, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
    
    const variants = {
      primary: 'btn-gradient text-white shadow-md hover:shadow-lg',
      secondary: 'bg-brand-off-white text-brand-dark-blue hover:bg-gray-100 border border-gray-200',
      outline: 'border-2 border-brand-primary-blue text-brand-primary-blue hover:bg-brand-primary-blue hover:text-white',
      ghost: 'text-brand-primary-blue hover:bg-brand-off-white hover:text-brand-dark-blue'
    }
    
    const sizes = {
      sm: 'h-9 px-3 text-sm min-w-touch',
      md: 'h-11 px-6 text-base min-w-touch min-h-touch',
      lg: 'h-12 px-8 text-lg min-w-touch'
    }
    
    const classes = cn(baseStyles, variants[variant], sizes[size], className)
    
    if (asChild) {
      return (
        <span className={classes}>
          {children}
        </span>
      )
    }
    
    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }