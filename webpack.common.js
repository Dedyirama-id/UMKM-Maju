const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    adminDashboard: './src/admin-dashboard.js',
    signup: './src/signup.js',
    userDashboard: './src/user-dashboard.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[contenthash].js',
    chunkFilename: '[name]-[contenthash].js',
    assetModuleFilename: 'img/[name]-[hash]',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/html/index.html',
      filename: 'index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: './src/html/404.html',
      filename: '404.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/html/admin-dashboard.html',
      filename: 'admin-dashboard.html',
      chunks: ['adminDashboard'],
    }),
    new HtmlWebpackPlugin({
      template: './src/html/signup.html',
      filename: 'signup.html',
      chunks: ['signup'],
    }),
    new HtmlWebpackPlugin({
      template: './src/html/user-dashboard.html',
      filename: 'user-dashboard.html',
      chunks: ['userDashboard'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
};
