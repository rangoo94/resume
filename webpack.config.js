// Load libraries

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Configure

const isProduction = process.env.NODE_ENV === 'production'

// Set up helpers

const styleLoader = isProduction ? MiniCssExtractPlugin.loader : 'style-loader'

const sassLoader = {
  loader: 'sass-loader',
  options: { implementation: require('sass'), sourceMap: true, sourceMapContents: false }
}

const optimizeImagesLoader = {
  loader: 'image-webpack-loader',
  options: { svgo: { plugins: [ { cleanupIDs: false } ] } }
}

const resolveUrlLoader = {
  loader: 'resolve-url-loader',
  options: { keepQuery: true }
}

const imageLoaders = isProduction ? [ 'file-loader', optimizeImagesLoader ] : [ 'file-loader' ]

// Build webpack configuration

module.exports = {
  mode: isProduction ? 'production' : 'development',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /[\/\\]node_modules[\/\\]/,
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [ styleLoader, 'css-loader', 'postcss-loader', resolveUrlLoader, sassLoader ]
      },

      {
        test: /\.(?:svg|png|jpg|jpeg|gif|webp)$/,
        use: imageLoaders
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.ejs'),
      minify: {
        collapseBooleanAttributes: true,
        conservativeCollapse: true,
        collapseWhitespace: true,
        removeComments: true,
        quoteCharacter: '"'
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/resume.ejs'),
      filename: 'resume.html',
      minify: {
        collapseBooleanAttributes: true,
        conservativeCollapse: true,
        collapseWhitespace: true,
        removeComments: true,
        quoteCharacter: '"'
      }
    }),
    new MiniCssExtractPlugin({ fileName: '[name]' })
  ],

  devServer: {
    contentBase: path.join(__dirname, 'src'),
    disableHostCheck: true,
    watchContentBase: true,
    hot: true
  }
}
