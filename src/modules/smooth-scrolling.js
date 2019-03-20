const hasSmoothScrollMechanism = !!Element.prototype.scrollIntoView

/**
 * Prepare anchor for selected element,
 * which may have different offset specified.
 *
 * @param {Element} element  where it should be attached
 * @param {number} offset  in px
 * @returns {Element}
 */
function prepareAnchorElement (element, offset) {
  // Build anchor element
  const anchorElement = document.createElement('a')

  // Make sure that it will not touch anything
  anchorElement.style.display = 'inline-block'
  anchorElement.style.position = 'absolute'
  anchorElement.style.width = '0'
  anchorElement.style.height = '0'
  anchorElement.style.overflow = 'hidden'
  anchorElement.style.pointerEvents = 'none'
  anchorElement.style.visibility = 'hidden'

  // Move by selected offset
  anchorElement.style.transform = 'translateY(' + offset + 'px)'

  // Attach anchor element
  insertChildrenBeforeAll(anchorElement, element)

  return anchorElement
}

/**
 * Add children to element, before all other child nodes.
 *
 * @param {Element} element  to insert
 * @param {Element} parentNode
 */
function insertChildrenBeforeAll (element, parentNode) {
  if (parentNode.childNodes.length === 0) {
    parentNode.appendChild(element)
  } else {
    parentNode.insertBefore(element, parentNode.childNodes[0])
  }
}

/**
 * Scroll smoothly to selected element.
 * You may also specify ID, which will be used as fallback and included in URL hash.
 *
 * @param {Element} element
 * @param {string} [id]
 * @param {number} [fallbackOffset]  used for default behavior
 */
function scrollToElement (element, id, fallbackOffset) {
  // Retrieve element ID if it's not specified
  if (!id && element.id) {
    id = element.id
  }

  // Make sure that we will use at least default behavior,
  // when something will go wrong
  try {
    // Use embedded browser mechanism to scroll smoothly to element
    element.scrollIntoView({ behavior: 'smooth' })

    // Replace hash in URL without touching 'hashchange' event
    if (id && history.pushState) {
      history.pushState(null, null, '#' + id);
    }
  } catch (e) {
    if (id) {
      // Go to selected hash
      window.location.hash = '#' + id

      // Move by offset
      window.scrollTo(window.scrollX, window.scrollY + fallbackOffset)
    }
  }
}

/**
 * Add smooth scrolling behavior to link.
 *
 * @param {Element} element
 */
function addSmoothScrollingToLink (element) {
  // Retrieve expected offset for scrolling
  const scrollOffset = (-1 * element.getAttribute('data-scroll-offset')) || 0

  // Retrieve ID of target element
  const targetId = element.getAttribute('href').substr(1)

  // Find target element
  const targetElement = document.getElementById(targetId)

  // Ignore scrolling mechanism when such element doesn't exist
  if (!targetElement) {
    return
  }

  // Build element with specified offset to move to,
  // or select target element directly, when there is no offset set.
  const anchorElement = !hasSmoothScrollMechanism || scrollOffset === 0
    ? targetElement
    : prepareAnchorElement(targetElement, scrollOffset)

  // Replace default click behavior on such link
  element.addEventListener('click', event => {
    event.preventDefault()
    scrollToElement(anchorElement, targetId, scrollOffset)
  })
}

// Retrieve all links which point to internal resources
const internalLinks = document.querySelectorAll('[href^="#"]')
const internalLinksArr = [].slice.call(internalLinks)

// Replace scrolling behavior for these internal links
internalLinksArr.forEach(addSmoothScrollingToLink)
