/**
 * Focus management utilities for accessibility
 */

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ')

  return Array.from(container.querySelectorAll(focusableSelectors))
}

/**
 * Trap focus within a container (useful for modals)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container)
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }
  }

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      // Return focus to the element that opened the modal
      const trigger = document.querySelector('[data-modal-trigger]') as HTMLElement
      trigger?.focus()
    }
  }

  container.addEventListener('keydown', handleTabKey)
  container.addEventListener('keydown', handleEscapeKey)

  // Focus the first element
  firstElement?.focus()

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey)
    container.removeEventListener('keydown', handleEscapeKey)
  }
}

/**
 * Manage focus restoration after route changes
 */
export function restoreFocus(targetSelector?: string) {
  if (typeof window === 'undefined') return

  const target = targetSelector 
    ? document.querySelector(targetSelector) as HTMLElement
    : document.querySelector('h1') as HTMLElement || document.querySelector('#main-content') as HTMLElement

  if (target) {
    // Make the target focusable if it isn't already
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1')
    }
    
    target.focus()
    
    // Remove tabindex after focus to restore natural tab order
    setTimeout(() => {
      if (target.getAttribute('tabindex') === '-1') {
        target.removeAttribute('tabindex')
      }
    }, 100)
  }
}

/**
 * Skip link functionality
 */
export function setupSkipLinks() {
  if (typeof window === 'undefined') return

  const skipLinks = document.querySelectorAll('.skip-link')
  
  skipLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      const target = document.querySelector('#main-content') as HTMLElement
      if (target) {
        target.setAttribute('tabindex', '-1')
        target.focus()
        target.addEventListener('blur', () => {
          target.removeAttribute('tabindex')
        }, { once: true })
      }
    })
  })
}

/**
 * Keyboard navigation for custom components
 */
export function handleArrowKeyNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  orientation: 'horizontal' | 'vertical' = 'horizontal'
): number {
  const { key } = event
  let newIndex = currentIndex

  if (orientation === 'horizontal') {
    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
    } else if (key === 'ArrowRight' || key === 'ArrowDown') {
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
    }
  } else {
    if (key === 'ArrowUp') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
    } else if (key === 'ArrowDown') {
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
    }
  }

  if (newIndex !== currentIndex) {
    event.preventDefault()
    items[newIndex]?.focus()
  }

  return newIndex
}

/**
 * Announce content changes to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof window === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}