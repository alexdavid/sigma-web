module.exports = {
  mode: "development",

  resolve: {
    extensions: [
      ".js",
      ".styl",
    ],
  },

  module: {
    rules: [{
      test: /.js$/,
      loader: "babel-loader",
      exclude: /node_modules/,
      query: {
        presets: ["@babel/react"]
      }
    }, {
      test: /.styl$/,
      loaders: [
        "style-loader",
        {loader: "css-loader", options: {
          modules: true,
          localIdentName: process.env.NODE_ENV == "production" ? "[hash:base64:5]" : "[path]__[local]",
        }},
        "stylus-loader",
      ],
    }],
  },
};
