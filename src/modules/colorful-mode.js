import { hasClass, addClass, removeClass } from '../utils/dom'

// Configuration

const COLORFUL_THEME_CLASS = 'theme-colorful'
const COLORFUL_THEME_PAUSE_CLASS = 'theme-colorful--pause'

const TOGGLE_RUNNING_CLASS = 'colorful-mode--running'

const TOGGLE_SELECTOR = '#colorful-mode-toggle'
const TOGGLE_LABEL_SELECTOR = '.colorful-mode__label'

const RUN_LABEL_ATTRIBUTE = 'data-label-run'
const PAUSE_LABEL_ATTRIBUTE = 'data-label-pause'

// DOM elements

const $button = document.querySelector(TOGGLE_SELECTOR)
const $label = $button && $button.querySelector(TOGGLE_LABEL_SELECTOR)

const labelPause = $button && $button.getAttribute(PAUSE_LABEL_ATTRIBUTE)
const labelStart = $button && $button.getAttribute(RUN_LABEL_ATTRIBUTE)

/**
 * Check if theme was included (at least once) on page.
 *
 * @returns {boolean}
 */
function isColorfulThemeAttached () {
  return hasClass(document.body, COLORFUL_THEME_CLASS)
}

/**
 * Is colorful theme paused?
 *
 * @returns {boolean}
 */
function isColorfulThemePaused () {
  return hasClass(document.body, COLORFUL_THEME_PAUSE_CLASS)
}

/**
 * Is colorful theme enabled?
 *
 * @returns {boolean}
 */
function isColorfulAnimationRunning () {
  return isColorfulThemeAttached() && !isColorfulThemePaused()
}

/**
 * Start colorful theme animation.
 */
function runColorfulAnimation () {
  // Ignore, when it's already running
  if (isColorfulThemeAttached() && !isColorfulThemePaused()) {
    return
  }

  // Include theme
  addClass(document.body, COLORFUL_THEME_CLASS)

  // Un-pause it for sure
  removeClass(document.body, COLORFUL_THEME_PAUSE_CLASS)

  // Change button
  addClass($button, TOGGLE_RUNNING_CLASS)
  $label.textContent = labelPause
}

/**
 * Pause colorful theme animation.
 */
function pauseColorfulAnimation () {
  // Ignore, there is nothing to pause
  if (!isColorfulAnimationRunning()) {
    return
  }

  // Inform document that colorful theme animation is paused
  addClass(document.body, COLORFUL_THEME_PAUSE_CLASS)

  // Update button
  removeClass($button, TOGGLE_RUNNING_CLASS)
  $label.textContent = labelStart
}

/**
 * Toggle start/pause colorful theme animation.
 */
function toggleColorfulAnimation () {
  if (isColorfulAnimationRunning()) {
    pauseColorfulAnimation()
  } else {
    runColorfulAnimation()
  }
}

// Add action to button if it's available
if ($button) {
  $button.addEventListener('click', toggleColorfulAnimation)
}
