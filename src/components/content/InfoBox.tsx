import { InfoBoxProps } from '@/types'

const iconMap = {
  info: '💡',
  warning: '⚠️',
  success: '✅',
  error: '❌'
}

const colorMap = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800'
}

export function InfoBox({ type, title, children }: InfoBoxProps) {
  const icon = iconMap[type]
  const colorClass = colorMap[type]

  return (
    <div className={`p-4 rounded-lg border-2 my-6 ${colorClass}`}>
      <div className="flex items-start">
        <span className="text-2xl mr-3 flex-shrink-0">{icon}</span>
        <div className="flex-1">
          {title && (
            <h4 className="font-bold text-lg mb-2">{title}</h4>
          )}
          <div className="prose prose-sm max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}