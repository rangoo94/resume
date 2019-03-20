import { random } from './random'

/**
 * Format text, so spaces will be always visible.
 *
 * @param {string} text
 * @returns {string}
 */
function formatText (text) {
  return text.replace(/ /g, String.fromCharCode(160))
}

/**
 * Get formatted text content from HTML element.
 *
 * @param {Element} element
 * @returns {string}
 */
function getElementText (element) {
  return formatText(element.textContent.trim())
}

/**
 * Class which adds typing behavior,
 * which may change text between different alternatives.
 */
export class TypingText {
  /**
   *
   * @param {Element} element
   * @param {string[]} alternatives
   *
   * TODO: probably 'writeAlternatives' should be another method, or even class
   */
  constructor (element, alternatives) {
    // Retrieve current element text
    const currentText = getElementText(element)

    // Make sure that there are any available alternatives
    if (!Array.isArray(alternatives)) {
      alternatives = [ currentText ]
    }

    // Set-up all data
    this.element = element
    this.alternatives = alternatives.map(formatText)
    this.isCaretVisible = false
    this.hasCaret = false

    // Reset text in text field
    this.setCurrentText(getElementText(element))
  }

  /**
   * Set current live text in element.
   *
   * @param {string} text
   */
  setCurrentText (text) {
    if (text === this.currentText) {
      return
    }

    this.element.innerText = text
    this.currentText = text
  }

  /**
   * Get current text which is visible in DOM element.
   *
   * @returns {string}
   */
  getCurrentText () {
    return this.currentText
    // return this.element.innerText
  }

  /**
   * Stop caret tick, so it will no longer blink.
   */
  stopCaretTick () {
    clearTimeout(this._caretTickTimeout)
    this._caretTickTimeout = null
  }

  /**
   * Start caret tick, so caret will start blinking.
   */
  startCaretTick () {
    this.stopCaretTick()
    this.tickCaret()
  }

  /**
   * Caret ticking, initiated by startCaretTick method.
   *
   * Hint: setTimeout is used, because setInterval after inactive time
   * will queue all expected actions on stack.
   */
  tickCaret () {
    this.toggleCaret()
    this._caretTickTimeout = setTimeout(
      () => this.tickCaret(),
      500
    )
  }

  /**
   * Initiate auto-writer tick,
   * so it will start writing alternatives.
   */
  startWriterTick () {
    this.stopWriterTick()
    this._writingTickTimeout = setTimeout(
      () => this.writeNextAlternative(() => this.startWriterTick()),
      3000
    )
  }

  /**
   * Writer ticking, initiated by startWriterTick method.
   *
   * Hint: setTimeout is used, because setInterval after inactive time
   * will queue all expected actions on stack.
   *
   * @param {function} [callback]
   */
  writeNextAlternative (callback) {
    // Find next alternative which should be shown
    const currentIndex = this.alternatives.indexOf(this.getCurrentText())
    const nextIndex = currentIndex >= this.alternatives.length - 1 ? 0 : currentIndex + 1

    // Write this text, and emit callback function
    this.write(this.alternatives[nextIndex], callback)
  }

  /**
   * Stop auto-writing,
   * so it will no longer try to write any text here.
   */
  stopWriterTick () {
    clearTimeout(this._writingTickTimeout)
    this._writingTickTimeout = null
  }

  /**
   * Write selected text in this DOM element.
   *
   * @param {string} text
   * @param {function} [callback]
   */
  write (text, callback) {
    return this._write(formatText(text), callback)
  }

  /**
   * Internal method to write selected text in DOM element,
   * used by 'write' method.
   *
   * @param {string} text
   * @param {function} [callback]
   * @private
   */
  _write (text, callback) {
    // Stop previously queued writing
    this.stopWriterTick()

    // Retrieve current text to determine next action
    const currentText = this.getCurrentText()

    // When it's already written, run callback
    if (text === currentText) {
      return callback ? callback(text) : undefined
    }

    // Remove (part of) text,
    // when current text is not matching beginning of expected phrase
    if (text.substr(0, currentText.length) !== currentText) {
      return this._removeFor(text, () => this._write(text, callback))
    }

    // Add next letter to element text
    this.setCurrentText(
      text.substr(0, currentText.length + 1)
    )

    // Queue next letter/check
    this._writingTickTimeout = setTimeout(
      () => this._write(text, callback),
      random(80, 300)
    )
  }

  /**
   * Internal method to remove text letters,
   * until it will match beginning of expected text.
   *
   * @param {string} text
   * @param {function} [callback]
   * @private
   */
  _removeFor (text, callback) {
    // Retrieve current text to determine next action
    const currentText = this.getCurrentText()

    // Run callback, when expected text starts with current text
    if (text.substr(0, currentText.length) === currentText) {
      return callback ? callback(currentText) : undefined
    }

    // Remove single letter from current text
    this.setCurrentText(
      currentText.substr(0, currentText.length - 1)
    )

    // Queue another letter removal/check
    this._writingTickTimeout = setTimeout(
      () => this._removeFor(text, callback),
      80
    )
  }

  /**
   * Add caret to element.
   *
   * @private
   */
  _addCaret () {
    if (!this.hasCaret) {
      this.element.style.borderRight = '0.2em solid transparent'
      this.hasCaret = true
    }
  }

  /**
   * Remove caret from element.
   *
   * @private
   */
  _removeCaret () {
    if (this.hasCaret) {
      // Hide caret
      this._hideCaret()

      // Remove spacing between text and caret
      this.element.style.borderRight = 'none'

      // Mark that there is no caret set-up
      this.hasCaret = false
    }
  }

  /**
   * Show (existing) caret.
   * Used by blinking action.
   *
   * @private
   */
  _showCaret () {
    if (this.hasCaret && !this.isCaretVisible) {
      // Show caret line
      this.element.style.boxShadow = '0.08em 0 0 0 currentColor'

      // Mark caret as visible
      this.isCaretVisible = true
    }
  }

  /**
   * Hide (existing) caret.
   * Used by blinking action.
   *
   * @private
   */
  _hideCaret () {
    if (this.hasCaret && this.isCaretVisible) {
      // Hide caret line
      this.element.style.boxShadow = 'none'

      // Mark caret as invisible
      this.isCaretVisible = false
    }
  }

  /**
   * Show/hide caret depending on current state.
   */
  toggleCaret () {
    if (this.isCaretVisible) {
      this._hideCaret()
    } else {
      this._showCaret()
    }
  }

  /**
   * Attach caret and events to current element.
   */
  attach () {
    this._addCaret()
    this.startCaretTick()
  }

  /**
   * Detach caret and events from current element.
   */
  detach () {
    this._removeCaret()
    this.stopCaretTick()
    this.stopWriterTick()
  }
}
