/**
 * Generate random number from selected range.
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function random (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
