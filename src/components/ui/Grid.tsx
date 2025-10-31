import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number | string
  children: React.ReactNode
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = { default: 1, md: 2, lg: 3 }, gap = 6, children, ...props }, ref) => {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12'
    }
    
    const responsiveClasses = [
      cols.default && gridCols[cols.default as keyof typeof gridCols],
      cols.sm && `sm:${gridCols[cols.sm as keyof typeof gridCols]}`,
      cols.md && `md:${gridCols[cols.md as keyof typeof gridCols]}`,
      cols.lg && `lg:${gridCols[cols.lg as keyof typeof gridCols]}`,
      cols.xl && `xl:${gridCols[cols.xl as keyof typeof gridCols]}`
    ].filter(Boolean)
    
    const gapClass = typeof gap === 'number' ? `gap-${gap}` : gap
    
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          ...responsiveClasses,
          gapClass,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Grid.displayName = 'Grid'

export { Grid }