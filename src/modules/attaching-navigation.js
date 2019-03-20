import { addClass, removeClass } from '../utils/dom'

// Set up configuration

const ATTACH_AT_Y_POSITION = 200
const NAVIGATION_SELECTOR = '.app-top-navigation'
const ATTACHED_CLASS = 'app-top-navigation--small'

// Set up initial data

let isTopNavigationAttached = false
const topNavigationElement = document.querySelector(NAVIGATION_SELECTOR)

/**
 * Attach navigation after page is scrolled down.
 */
function attachNavigation () {
  if (isTopNavigationAttached) {
    return
  }

  isTopNavigationAttached = true
  addClass(topNavigationElement, ATTACHED_CLASS)
}

/**
 * Detach navigation when page is on top.
 */
function detachNavigation () {
  if (!isTopNavigationAttached) {
    return
  }

  isTopNavigationAttached = false
  removeClass(topNavigationElement, ATTACHED_CLASS)
}

/**
 * Refresh current navigation state.
 */
function refreshNavigation () {
  const shouldBeAttached = window.scrollY >= ATTACH_AT_Y_POSITION

  if (shouldBeAttached) {
    attachNavigation()
  } else {
    detachNavigation()
  }
}

// Update navigation initially
refreshNavigation()

// Update navigation on scroll
window.addEventListener('scroll', refreshNavigation)
