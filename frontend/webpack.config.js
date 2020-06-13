module.exports = (env, argv) => ({
  mode: "development",

  resolve: {
    extensions: [
      ".tsx",
      ".ts",
      ".js",
      ".styl",
    ],
  },

  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
    }, {
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
          localIdentName: argv.mode == "production" ? "[hash:base64:5]" : "[path]__[local]",
        }},
        "postcss-loader",
        "stylus-loader",
      ],
    }, {
      test: /.svg$/,
      loader: "url-loader",
    }],
  },
});
