// Configuration

const MASKING_CHARACTER = '•'
// const MASKING_CHARACTER = '█'

/**
 * Mask text with full-block characters.
 *
 * @param {string} str
 * @returns {string}
 */
function mask (str) {
  return str.replace(/[^\s]/g, MASKING_CHARACTER)
}

/**
 * Mask element' content.
 *
 * @param {Element} element
 */
function maskContent (element) {
  element.textContent = mask(element.textContent)
}

/**
 * Mask element attribute.
 *
 * @param {Element} element
 */
function maskAttribute (element) {
  const attribute = element.getAttribute('data-masked-attr')

  if (attribute === 'href') {
    element.removeAttribute(attribute)
  } else {
    element.setAttribute(attribute, mask(element.getAttribute(attribute)))
  }
}

/**
 * Mask image element.
 *
 * @param {Element} element
 */
function maskImage (element) {
  const rect = element.getBoundingClientRect()

  // Icon used from https://www.iconfinder.com/icons/2981783/alien_astronomy_creature_extraterrestrial_space_icon
  element.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<?xml version="1.0" ?><svg viewBox="0 0 64 64" width="' + rect.width + '" height="' + rect.height + '" xmlns="http://www.w3.org/2000/svg"><path fill="#1d1d1b" d="M45.76,11c-3-3.66-8.91-5.56-12.44-5.41S22.79,6.81,19.69,10.31s-4,7.63-4.34,11.38.41,6.66,4.94,13.75A31.43,31.43,0,0,0,31.38,45.81l-.16,2.09a3.88,3.88,0,0,0-1.56.47,5.48,5.48,0,0,0-2.41,2.06c-.56,1-.37,1.59.38,1.91a1,1,0,0,0,1.25-.22c.25-.16.13-.47,0-.75s-.09-.53.34-1a4.24,4.24,0,0,1,1.53-.78,16.13,16.13,0,0,0-.25,2.31,7.29,7.29,0,0,0,.34,2.53L31,56.28a5.32,5.32,0,0,0-2.25-.37c-.91.16-1,1.94-.87,2.28s3.84.16,4,0a27.54,27.54,0,0,0,0-3.59c0-.16.75,0,.84.06s-.06,2.94,0,3.47,2.66.19,3.22.09.44-.94.28-1.66S33.69,56,33.69,56l0-1.66s.22.06.5-.81a20.78,20.78,0,0,0,.16-4,.76.76,0,0,1,.59.25,6,6,0,0,1,.44,1.78,2.18,2.18,0,0,0,1,1.47,1.33,1.33,0,0,0,1.69-.72c.25-.62-1.41-2.47-2-3.09A8,8,0,0,0,34,48l-.09-2.28s2.38-.53,3-.78,1.81-.5,4.38-3.84,4.91-8.84,6.56-14.81S48.79,14.63,45.76,11ZM33,53.59c-.41.13-1.25.25-1.44-.09s.25-7.22,1-7.22c.22,0,.69,0,.72,1.47S33.44,53.47,33,53.59ZM44.38,31A49.84,49.84,0,0,1,41,37.5s-.62-1-.78-1-.66.22-.53.34,1,1.15.88,1.37-.94,1.41-.94,1.41-.71-1.11-.8-1.08-.6.14-.45.42.94,1.16.81,1.38a3.34,3.34,0,0,1-.69.78c-.19.13-1.22-1.26-1.31-1.26s-.41,0-.47.22,1.09,1.64,1,1.82a5.6,5.6,0,0,1-1.16,1l-.25.09a24,24,0,0,0-1.55-2.23c-.12,0-.69.19-.59.41s1.49,2,1.33,2.14a6.87,6.87,0,0,1-1.25.5S33.26,42,33.07,42s-.66.19-.62.34.72,1.59.72,1.59a3.74,3.74,0,0,1-2.66-.5c-1.19-.75-5.44-5-8.87-9.28a19.85,19.85,0,0,1-4.19-12.91c.13-3.56,2.38-9.28,5.94-11.34A21.5,21.5,0,0,1,36.82,7.72a12.46,12.46,0,0,1,9.59,8.53C47.72,20.41,45.47,28.19,44.38,31ZM22.82,15.69c.28-.16.41-1,.75-1.81s1.94-1.59,2-1.69-.16-.84-.34-.91S24,11.53,22.91,13a5.37,5.37,0,0,0-1.19,2.44A1,1,0,0,0,22.82,15.69ZM35.5,35.59c-.3-.1-1,.35-1.85.66s-2.48-.37-2.59-.35-.52.68-.44.86,1,.74,2.8.58a5.37,5.37,0,0,0,2.6-.75A1,1,0,0,0,35.5,35.59ZM31,25.22c-1.94-3.91-5.49-5.25-6.91-5.09a4.91,4.91,0,0,0-3.25,1.56c-.69.72-.81,3.13,1.53,6s4.38,3.41,6.44,3.47S33,29.13,31,25.22Zm8.72-5.09C34.88,22.56,34,25.56,34.19,28S36.6,30.53,39,29.88a7.35,7.35,0,0,0,5.34-6.37C44.76,19.88,41.32,19.34,39.76,20.13Z"/></svg>')
}

/**
 * Get array of elements.
 *
 * @param {string} selector
 * @returns {Element[]}
 */
function getElements (selector) {
  return [].slice.call(document.querySelectorAll(selector))
}

/**
 * Mask everything vulnerable in resume.
 */
function maskResume () {
  getElements('[data-masked]').forEach(maskContent)
  getElements('[data-masked-attr]').forEach(maskAttribute)
  getElements('[data-masked-image]').forEach(maskImage)
}

// Expose 'maskResume' method
window.maskResume = maskResume
