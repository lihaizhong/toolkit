const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        }],
        enforce: 'post',
        exclude: /node_modules|\.spec\.js$/
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../tools')
    }
  }
}
