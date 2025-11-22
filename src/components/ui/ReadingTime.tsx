import { Clock } from 'lucide-react'

interface ReadingTimeProps {
  minutes: number
  className?: string
}

export function ReadingTime({ minutes, className = '' }: ReadingTimeProps) {
  return (
    <div className={`flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      <Clock className="w-4 h-4" />
      <span>{minutes} min de leitura</span>
    </div>
  )
}
