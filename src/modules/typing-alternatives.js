import { TypingText } from '../utils/TypingText'

// Retrieve DOM elements which should have typing behavior
const elements = document.querySelectorAll('[data-typing-alternatives]')
const elementsList = [].slice.call(elements)

// Add typing text behavior to all elements which expect that
elementsList.forEach(element => {
  try {
    // Retrieve possible alternatives from DOM element
    const alternatives = JSON.parse(element.getAttribute('data-typing-alternatives'))

    // Attach typing text behavior to this element
    const typingText = new TypingText(element, alternatives)
    typingText.attach()

    // Start writing alternatives
    typingText.startWriterTick()
  } catch (error) {
    // Ignore problems with typing text and lift error
    setTimeout(() => { throw error })
  }
})
