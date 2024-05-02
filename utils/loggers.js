const info = (message, { origin = 'info' } = {}) => console.log(`[${origin}] ${message}`)

const error = (message, { origin = 'error' } = {}) => console.log(`[${origin}] ${message}`)

module.exports = {
  info,
  error
}
