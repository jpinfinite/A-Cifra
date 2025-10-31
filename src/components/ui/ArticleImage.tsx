import { Image } from './Image'
import { cn } from '@/utils/cn'

interface ArticleImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  caption?: string
}

export function ArticleImage({ 
  src, 
  alt, 
  width = 800, 
  height = 450, 
  className,
  priority = false,
  caption,
  ...props 
}: ArticleImageProps) {
  return (
    <figure className={cn('my-8', className)}>
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-cover"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          {...props}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-600 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}