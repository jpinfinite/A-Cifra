import { Image } from './Image'
import { cn } from '@/utils/cn'

interface CoverImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  aspectRatio?: 'video' | 'square' | 'portrait'
}

export function CoverImage({ 
  src, 
  alt, 
  className,
  priority = false,
  aspectRatio = 'video',
  ...props 
}: CoverImageProps) {
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]'
  }

  return (
    <div className={cn(
      'relative overflow-hidden rounded-lg bg-gray-100',
      aspectClasses[aspectRatio],
      className
    )}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
    </div>
  )
}