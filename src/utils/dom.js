/**
 * Check if element has selected class name.
 * This function gives abstraction layer to accept later older browsers.
 *
 * @param {Element} element
 * @param {string} className
 */
export function hasClass (element, className) {
  return element.classList.contains(className)
}

/**
 * Add class name to DOM element.
 * This function gives abstraction layer to accept later older browsers.
 *
 * @param {Element} element
 * @param {string} className
 */
export function addClass (element, className) {
  return element.classList.add(className)
}

/**
 * Remove class name to DOM element.
 * This function gives abstraction layer to accept later older browsers.
 *
 * @param {Element} element
 * @param {string} className
 */
export function removeClass (element, className) {
  return element.classList.remove(className)
}
