const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    static: {
      directory: './src/index.html',
      watch: true,
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      optimization: {
        minimizer: true,
      },
    },
  },
});
