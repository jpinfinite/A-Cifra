'use client'

import { ReactNode } from 'react'

interface AlertBoxProps {
  children: ReactNode
  variant?: 'critical' | 'warning' | 'info' | 'success'
  icon?: string
}

const variantStyles = {
  critical: {
    background: 'linear-gradient(135deg, #8B0000 0%, #DC143C 100%)',
    borderColor: '#DC143C',
    iconDefault: '🔐'
  },
  warning: {
    background: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)',
    borderColor: '#FFA500',
    iconDefault: '⚠️'
  },
  info: {
    background: 'linear-gradient(135deg, #00283B 0%, #155C8B 100%)',
    borderColor: '#155C8B',
    iconDefault: 'ℹ️'
  },
  success: {
    background: 'linear-gradient(135deg, #006400 0%, #228B22 100%)',
    borderColor: '#228B22',
    iconDefault: '✅'
  }
}

export const AlertBox = ({ 
  children, 
  variant = 'info',
  icon 
}: AlertBoxProps) => {
  const styles = variantStyles[variant]
  const displayIcon = icon || styles.iconDefault

  return (
    <div
      style={{
        background: styles.background,
        color: '#F5F7FA',
        borderRadius: 12,
        padding: '20px 24px',
        margin: '24px 0',
        boxShadow: '0 4px 16px rgba(21, 92, 139, 0.25)',
        border: `2px solid ${styles.borderColor}`,
        fontSize: '1rem',
        lineHeight: '1.6'
      }}
      role="alert"
      aria-live="polite"
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1.5rem', flexShrink: 0 }} aria-hidden="true">
          {displayIcon}
        </span>
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  )
}
