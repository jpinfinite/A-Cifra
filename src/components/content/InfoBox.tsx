'use client'

import { ReactNode } from 'react'

interface InfoBoxProps {
  children: ReactNode
  title?: string
  icon?: string
  variant?: 'default' | 'premium' | 'highlight'
}

const variantStyles = {
  default: {
    background: 'linear-gradient(135deg, rgba(0, 40, 59, 0.1) 0%, rgba(21, 92, 139, 0.1) 100%)',
    borderColor: '#155C8B',
    titleColor: '#00283B'
  },
  premium: {
    background: 'linear-gradient(135deg, rgba(0, 40, 59, 0.95) 0%, rgba(21, 92, 139, 0.95) 100%)',
    borderColor: '#155C8B',
    titleColor: '#FFD700'
  },
  highlight: {
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 193, 7, 0.15) 100%)',
    borderColor: '#FFD700',
    titleColor: '#B8860B'
  }
}

export const InfoBox = ({ 
  children, 
  title,
  icon = 'ℹ️',
  variant = 'default'
}: InfoBoxProps) => {
  const styles = variantStyles[variant]
  const textColor = variant === 'premium' ? '#F5F7FA' : '#1a1a1a'

  return (
    <div
      style={{
        background: styles.background,
        color: textColor,
        borderRadius: 12,
        padding: '20px 24px',
        margin: '24px 0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: `2px solid ${styles.borderColor}`,
        backdropFilter: variant === 'premium' ? 'blur(10px)' : 'none'
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {icon && (
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }} aria-hidden="true">
            {icon}
          </span>
        )}
        <div style={{ flex: 1 }}>
          {title && (
            <strong style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '1.1rem',
              color: styles.titleColor
            }}>
              {title}
            </strong>
          )}
          <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
