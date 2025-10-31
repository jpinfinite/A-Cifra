import { validateBrandColors } from './accessibility'

// Run color validation and log results
export function logColorValidation() {
  if (process.env.NODE_ENV === 'development') {
    const results = validateBrandColors()

    console.group('Brand Color Accessibility Validation')

    results.forEach(result => {
      const status = result.passesAA ? '[PASS]' : '[FAIL]'
      const aaaStatus = result.passesAAA ? '[PASS AAA]' : '[FAIL AAA]'

      // Development only logging
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `${status} ${result.name}: ${result.ratio.toFixed(2)}:1 ${aaaStatus}`
        )
      }
    })

    const passedAA = results.filter(r => r.passesAA).length
    const passedAAA = results.filter(r => r.passesAAA).length

    console.log(`\nSummary: ${passedAA}/${results.length} pass AA, ${passedAAA}/${results.length} pass AAA`)
    console.groupEnd()
  }
}

// Call validation in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  logColorValidation()
}