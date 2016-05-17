export default {
  entry: __dirname + "/src/app.js",
  output: {
    path: __dirname + '/public/scripts',
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.jx|jsx$/,
        exclude: /node_modules/,
        loader: "eslint"
      }
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel"
      }
    ]
  },
  eslint: {
    configFile: '.eslintrc'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
