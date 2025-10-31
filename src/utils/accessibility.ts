/**
 * Accessibility utilities for color contrast and typography validation
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Calculate relative luminance of a color
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return 0
  
  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b)
  
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Check if color combination meets WCAG contrast requirements
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background)
  
  const requirements = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 }
  }
  
  return ratio >= requirements[level][size]
}

/**
 * Validate brand colors against WCAG standards
 */
export function validateBrandColors() {
  const brandColors = {
    'dark-blue': '#041924',
    'medium-blue': '#00283B',
    'primary-blue': '#155C8B',
    'off-white': '#F5F7FA',
    'gold': '#E1A441',
    'white': '#FFFFFF',
    'black': '#000000'
  }
  
  const combinations = [
    // Text on backgrounds
    { fg: brandColors['dark-blue'], bg: brandColors['off-white'], name: 'Dark blue on off-white' },
    { fg: brandColors['dark-blue'], bg: brandColors['white'], name: 'Dark blue on white' },
    { fg: brandColors['medium-blue'], bg: brandColors['off-white'], name: 'Medium blue on off-white' },
    { fg: brandColors['medium-blue'], bg: brandColors['white'], name: 'Medium blue on white' },
    { fg: brandColors['primary-blue'], bg: brandColors['off-white'], name: 'Primary blue on off-white' },
    { fg: brandColors['primary-blue'], bg: brandColors['white'], name: 'Primary blue on white' },
    { fg: brandColors['white'], bg: brandColors['dark-blue'], name: 'White on dark blue' },
    { fg: brandColors['white'], bg: brandColors['medium-blue'], name: 'White on medium blue' },
    { fg: brandColors['white'], bg: brandColors['primary-blue'], name: 'White on primary blue' },
    { fg: brandColors['gold'], bg: brandColors['dark-blue'], name: 'Gold on dark blue' },
    { fg: brandColors['gold'], bg: brandColors['white'], name: 'Gold on white' },
  ]
  
  const results = combinations.map(combo => ({
    ...combo,
    ratio: getContrastRatio(combo.fg, combo.bg),
    passesAA: meetsContrastRequirement(combo.fg, combo.bg, 'AA'),
    passesAAA: meetsContrastRequirement(combo.fg, combo.bg, 'AAA')
  }))
  
  return results
}

/**
 * Typography accessibility utilities
 */
export const typographyGuidelines = {
  minFontSizes: {
    mobile: {
      body: '16px',
      small: '14px',
      large: '18px'
    },
    desktop: {
      body: '16px',
      small: '14px',
      large: '18px'
    }
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  },
  maxLineLength: {
    characters: 75,
    words: 12
  }
}

/**
 * Check if font size meets accessibility guidelines
 */
export function isAccessibleFontSize(
  fontSize: number,
  unit: 'px' | 'rem' | 'em' = 'px',
  context: 'mobile' | 'desktop' = 'desktop'
): boolean {
  let sizeInPx = fontSize
  
  if (unit === 'rem' || unit === 'em') {
    sizeInPx = fontSize * 16 // Assuming 16px base font size
  }
  
  const minSize = context === 'mobile' ? 16 : 16
  return sizeInPx >= minSize
}

/**
 * Generate accessible color palette variations
 */
export function generateAccessibleVariations(baseColor: string): {
  lighter: string[]
  darker: string[]
  accessible: { background: string; foreground: string }[]
} {
  // This is a simplified implementation
  // In a real application, you might use a color manipulation library
  return {
    lighter: [], // Would contain lighter variations
    darker: [], // Would contain darker variations
    accessible: [
      { background: '#FFFFFF', foreground: baseColor },
      { background: baseColor, foreground: '#FFFFFF' }
    ]
  }
}

/**
 * Accessibility audit for a page
 */
export function auditPageAccessibility(): {
  contrastIssues: string[]
  focusIssues: string[]
  semanticIssues: string[]
  recommendations: string[]
} {
  if (typeof window === 'undefined') {
    return {
      contrastIssues: [],
      focusIssues: [],
      semanticIssues: [],
      recommendations: []
    }
  }
  
  const issues = {
    contrastIssues: [] as string[],
    focusIssues: [] as string[],
    semanticIssues: [] as string[],
    recommendations: [] as string[]
  }
  
  // Check for missing alt attributes
  const images = document.querySelectorAll('img:not([alt])')
  if (images.length > 0) {
    issues.semanticIssues.push(`${images.length} images missing alt attributes`)
  }
  
  // Check for missing form labels
  const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])')
  const unlabeledInputs = Array.from(inputs).filter(input => {
    const id = input.getAttribute('id')
    return !id || !document.querySelector(`label[for="${id}"]`)
  })
  
  if (unlabeledInputs.length > 0) {
    issues.semanticIssues.push(`${unlabeledInputs.length} form inputs missing labels`)
  }
  
  // Check for heading hierarchy
  const h1Count = document.querySelectorAll('h1').length
  
  if (h1Count === 0) {
    issues.semanticIssues.push('Page missing h1 heading')
  } else if (h1Count > 1) {
    issues.semanticIssues.push('Page has multiple h1 headings')
  }
  
  // Add recommendations
  issues.recommendations.push('Test with keyboard navigation')
  issues.recommendations.push('Test with screen reader')
  issues.recommendations.push('Validate color contrast ratios')
  issues.recommendations.push('Check focus indicators visibility')
  
  return issues
}