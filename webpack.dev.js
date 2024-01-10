const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    hot: true,
    static: [
      {
        directory: './src/html',
        watch: true,
      },
      {
        directory: './src/styles',
        watch: true,
      },
    ],
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  optimization: {
    minimize: true,
  },
});
