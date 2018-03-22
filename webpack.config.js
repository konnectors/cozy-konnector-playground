const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const SRC_DIR = path.dirname(require.resolve('./src'))

module.exports = {
  mode: 'development',
  entry: {
    index: path.join(SRC_DIR, './index.js'),
    panel: path.join(SRC_DIR, './panel.js'),
    toInject: path.join(SRC_DIR, './toInject.js')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      zepto: 'zepto-webpack'
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [SRC_DIR],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      }
    ]
  },
  target: 'web',
  devtool: false,
  plugins: [
    new CopyPlugin([
      { from: 'src/index.html', to: '.' },
      { from: 'src/panel.html', to: '.' },
      { from: 'manifest.json', to: '.' },
      { from: 'src/logo-cozy.png', to: '.' }
    ])
  ]
}
