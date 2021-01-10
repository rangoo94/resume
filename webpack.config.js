// Load libraries

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const workboxPlugin = require('workbox-webpack-plugin')

// Configure

const isProduction = process.env.NODE_ENV === 'production'

// Set up helpers

const styleLoader = isProduction ? MiniCssExtractPlugin.loader : 'style-loader'

const sassLoader = {
  loader: 'sass-loader',
  options: { sourceMap: true }
}

const optimizeImagesLoader = {
  loader: 'image-webpack-loader',
  options: { svgo: { plugins: [ { cleanupIDs: false } ] } }
}

const resolveUrlLoader = {
  loader: 'resolve-url-loader',
  options: { keepQuery: true }
}

const fileLoader = {
  loader: 'file-loader',
  options: { esModule: false }
}

const imageLoaders = isProduction ? [ fileLoader, optimizeImagesLoader ] : [ fileLoader ]

// Build webpack configuration

module.exports = {
  mode: isProduction ? 'production' : 'development',

  output: {
    publicPath: '',
    filename: isProduction ? '[name].[contenthash].js' : '[name].js'
  },

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
    new MiniCssExtractPlugin({
      filename: isProduction ? '[name].[contenthash].css' : '[name].css'
    }),
    new workboxPlugin.GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        // Google Fonts
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets'
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            cacheableResponse: {
              statuses: [ 0, 200 ]
            },
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365
            }
          }
        },

        // FontAwesome icons
        {
          urlPattern: /^https:\/\/use\.fontawesome\.com\/releases\/.*\.css$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'fontawesome-stylesheets'
          }
        },
        {
          urlPattern: /^https:\/\/use\.fontawesome\.com\/releases\/.*\.(woff2|ttf|woff|eot|svg)/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'fontawesome-webfonts',
            cacheableResponse: {
              statuses: [ 0, 200 ]
            },
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365
            }
          }
        }
      ]
    }),
    new WebpackPwaManifest({
      name: 'Dawid Rusnak Resume',
      short_name: 'DRCodeResume',
      description: 'Full-Stack Web Developer and Software Architect, who specializes in React on front-end and Node.js in back-end.',
      background_color: '#fff',
      theme_color: '#217ad0',
      icons: [
        {
          src: path.resolve('assets/images/icon.png'),
          sizes: [ 36, 48, 72, 96, 120, 144, 152, 167, 180, 192, 512, 1024 ]
        }
      ]
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, 'src'),
    disableHostCheck: true,
    watchContentBase: true,
    hot: true
  }
}
