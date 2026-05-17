/**
 * Performance utilities for optimization
 */

/**
 * Debounce function to prevent excessive function calls
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function to limit function calls frequency
 */
export function throttle(func, limit) {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Batch DOM updates to improve performance
 */
export function batchUpdates(callback) {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(callback, { timeout: 2000 })
  } else {
    requestAnimationFrame(callback)
  }
}

/**
 * Intersection Observer helper for lazy loading
 */
export function useIntersectionObserver(ref, onVisible, options = {}) {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options,
  }

  if (typeof window === 'undefined') return

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        onVisible()
        observer.unobserve(entry.target)
      }
    })
  }, defaultOptions)

  if (ref?.current) {
    observer.observe(ref.current)
  }

  return () => observer.disconnect()
}
