module.exports = api => {
  api.cache.forever()

  return {
    presets: [
      [ '@babel/preset-env', { useBuiltIns: 'entry' } ]
    ],
    plugins: [
      '@babel/plugin-transform-runtime'
    ]
  }
}
