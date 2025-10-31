'use client'

import { ReactNode } from 'react'

interface TipBoxProps {
  children: ReactNode
  title?: string
  icon?: string
}

export const TipBox = ({ 
  children, 
  title = 'Dica',
  icon = '💡'
}: TipBoxProps) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(0, 40, 59, 0.95) 0%, rgba(21, 92, 139, 0.95) 100%)',
        color: '#F5F7FA',
        borderRadius: 12,
        padding: '20px 24px',
        margin: '24px 0',
        boxShadow: '0 4px 16px rgba(21, 92, 139, 0.3)',
        border: '2px solid rgba(21, 92, 139, 0.5)',
        backdropFilter: 'blur(10px)',
        position: 'relative' as const,
        overflow: 'hidden'
      }}
    >
      {/* Efeito glass sutil */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
        }}
        aria-hidden="true"
      />
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1.5rem', flexShrink: 0 }} aria-hidden="true">
          {icon}
        </span>
        <div style={{ flex: 1 }}>
          <strong style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '1.1rem',
            color: '#FFD700'
          }}>
            {title}
          </strong>
          <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
