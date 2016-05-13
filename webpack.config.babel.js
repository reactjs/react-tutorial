export default {
  entry: __dirname + "/src/app.js",
  output: {
    path: __dirname + '/public/scripts',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel"
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
