const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: {
    index: {
      import: './src/index.js',
      dependOn: 'shared',
    },
    adminDashboard: {
      import: './src/admin-dashboard.js',
      dependOn: 'shared',
    },
    signup: {
      import: './src/signup.js',
      dependOn: 'shared',
    },
    userDashboard: {
      import: './src/user-dashboard.js',
      dependOn: 'shared',
    },
    shared: './src/shared.js',
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
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
      chunks: ['index', 'shared'],
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      template: './src/html/404.html',
      filename: '404.html',
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      template: './src/html/admin-dashboard.html',
      filename: 'admin-dashboard.html',
      chunks: ['adminDashboard', 'shared'],
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      template: './src/html/signup.html',
      filename: 'signup.html',
      chunks: ['signup', 'shared'],
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      template: './src/html/user-dashboard.html',
      filename: 'user-dashboard.html',
      chunks: ['userDashboard', 'shared'],
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: 'style-[contenthash].css',
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
    runtimeChunk: 'single',
  },
};
