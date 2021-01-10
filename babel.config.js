module.exports = api => {
  api.cache.forever()

  return {
    presets: [
      [ '@babel/preset-env', { useBuiltIns: 'entry', corejs: 2 } ]
    ],
    plugins: [
      '@babel/plugin-transform-runtime'
    ]
  }
}
