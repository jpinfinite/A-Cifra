'use client'

import { ReactNode } from 'react'

interface WarningBoxProps {
  children: ReactNode
  title?: string
  severity?: 'high' | 'medium' | 'low'
}

const severityConfig = {
  high: {
    icon: '🚨',
    color: '#FF4444',
    background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.95) 0%, rgba(220, 20, 60, 0.95) 100%)',
    border: '#DC143C'
  },
  medium: {
    icon: '⚠️',
    color: '#FFA500',
    background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.95) 0%, rgba(255, 165, 0, 0.95) 100%)',
    border: '#FFA500'
  },
  low: {
    icon: '⚡',
    color: '#FFD700',
    background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.95) 0%, rgba(218, 165, 32, 0.95) 100%)',
    border: '#DAA520'
  }
}

export const WarningBox = ({ 
  children, 
  title = 'Atenção',
  severity = 'medium'
}: WarningBoxProps) => {
  const config = severityConfig[severity]

  return (
    <div
      style={{
        background: config.background,
        color: '#F5F7FA',
        borderRadius: 12,
        padding: '20px 24px',
        margin: '24px 0',
        boxShadow: `0 4px 16px rgba(220, 20, 60, 0.3)`,
        border: `2px solid ${config.border}`,
        backdropFilter: 'blur(10px)',
        position: 'relative' as const,
        overflow: 'hidden'
      }}
      role="alert"
      aria-live="assertive"
    >
      {/* Efeito de brilho animado */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
          animation: 'shimmer 2s infinite'
        }}
        aria-hidden="true"
      />
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span 
          style={{ 
            fontSize: '1.8rem', 
            flexShrink: 0,
            animation: severity === 'high' ? 'pulse 1.5s infinite' : 'none'
          }} 
          aria-hidden="true"
        >
          {config.icon}
        </span>
        <div style={{ flex: 1 }}>
          <strong style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '1.1rem',
            color: config.color,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </strong>
          <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            {children}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
