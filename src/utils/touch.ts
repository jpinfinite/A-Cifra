/**
 * Touch interaction utilities for mobile optimization
 */

// Extend Navigator interface for legacy IE property
interface NavigatorWithMSTouch extends Navigator {
  msMaxTouchPoints?: number
}

/**
 * Detect if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  const nav = navigator as NavigatorWithMSTouch
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (nav.msMaxTouchPoints !== undefined && nav.msMaxTouchPoints > 0)
  )
}

/**
 * Add touch-friendly hover effects
 */
export function addTouchHover(element: HTMLElement) {
  if (!isTouchDevice()) return
  
  element.addEventListener('touchstart', () => {
    element.classList.add('touch-hover')
  })
  
  element.addEventListener('touchend', () => {
    setTimeout(() => {
      element.classList.remove('touch-hover')
    }, 150)
  })
  
  element.addEventListener('touchcancel', () => {
    element.classList.remove('touch-hover')
  })
}

/**
 * Prevent zoom on double tap for specific elements
 */
export function preventDoubleTabZoom(element: HTMLElement) {
  let lastTouchEnd = 0
  
  element.addEventListener('touchend', (event) => {
    const now = new Date().getTime()
    if (now - lastTouchEnd <= 300) {
      event.preventDefault()
    }
    lastTouchEnd = now
  }, false)
}

/**
 * Smooth scroll with touch momentum
 */
export function enableSmoothScroll(element: HTMLElement) {
  // Apply webkit-specific scrolling for iOS
  const style = element.style as CSSStyleDeclaration & {
    webkitOverflowScrolling?: string
    overflowScrolling?: string
  }
  
  style.webkitOverflowScrolling = 'touch'
  style.overflowScrolling = 'touch'
}

/**
 * Swipe gesture detection
 */
export interface SwipeOptions {
  threshold?: number
  restraint?: number
  allowedTime?: number
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export function addSwipeGesture(element: HTMLElement, options: SwipeOptions = {}) {
  const {
    threshold = 150,
    restraint = 100,
    allowedTime = 300,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  } = options
  
  let startX = 0
  let startY = 0
  let startTime = 0
  
  element.addEventListener('touchstart', (e) => {
    const touch = e.touches[0]
    startX = touch.clientX
    startY = touch.clientY
    startTime = new Date().getTime()
  })
  
  element.addEventListener('touchend', (e) => {
    const touch = e.changedTouches[0]
    const distX = touch.clientX - startX
    const distY = touch.clientY - startY
    const elapsedTime = new Date().getTime() - startTime
    
    if (elapsedTime <= allowedTime) {
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        // Horizontal swipe
        if (distX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (distX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
        // Vertical swipe
        if (distY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (distY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }
  })
}

/**
 * Optimize button tap delay
 */
export function optimizeButtonTap(button: HTMLElement) {
  // Remove 300ms tap delay on iOS
  button.style.touchAction = 'manipulation'
  
  // Add visual feedback
  button.addEventListener('touchstart', () => {
    button.style.transform = 'scale(0.98)'
  })
  
  button.addEventListener('touchend', () => {
    button.style.transform = 'scale(1)'
  })
  
  button.addEventListener('touchcancel', () => {
    button.style.transform = 'scale(1)'
  })
}

/**
 * Safe area insets for devices with notches
 */
export function applySafeAreaInsets(element: HTMLElement, areas: ('top' | 'bottom' | 'left' | 'right')[]) {
  areas.forEach(area => {
    element.style.setProperty(`padding-${area}`, `max(env(safe-area-inset-${area}), var(--safe-area-${area}, 0px))`)
  })
}

/**
 * Viewport height fix for mobile browsers
 */
export function setViewportHeight() {
  if (typeof window === 'undefined') return
  
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
  
  window.addEventListener('resize', () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  })
}

/**
 * Prevent overscroll bounce on iOS
 */
export function preventOverscrollBounce() {
  if (typeof window === 'undefined') return
  
  document.body.style.overscrollBehavior = 'none'
  
  // Prevent pull-to-refresh
  let startY = 0
  
  document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY
  })
  
  document.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY
    const isScrollingUp = currentY > startY
    const isAtTop = window.scrollY === 0
    
    if (isAtTop && isScrollingUp) {
      e.preventDefault()
    }
  }, { passive: false })
}