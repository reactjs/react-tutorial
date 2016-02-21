var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry: './public/scripts/questions.js',
  output: {
    path: __dirname + "/public",
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, "public/scripts")
        ],
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }

      }
      //{ test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // use ! to chain loaders
      //{ test: /\.css$/, loader: 'style-loader!css-loader' },
      //{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' } // inline base64 URLs for <=8k images, direct URLs for the rest
    ]
  },
  plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
    })
  ]
};
