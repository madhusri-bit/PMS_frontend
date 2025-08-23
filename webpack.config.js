const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: { path: path.resolve(__dirname, 'dist'), filename: 'bundle.js', publicPath: '/' },
  devServer: { static: './public', port: 8081, historyApiFallback: true, allowedHosts: 'all' },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env','@babel/preset-react'] }}},
      { test: /\.css$/, use: ['style-loader','css-loader'] }
    ]
  },
  resolve: { extensions: ['.js','.jsx'] }
};
