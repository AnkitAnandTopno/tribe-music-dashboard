module.exports = {
  //...
  devServer: {
    contentBase: __dirname + "/public/",
    inline: true,
    host: "0.0.0.0",
    port: 8080
  },
  output: {
    path: __dirname + "/public",
    filename: "assets/bundle.js",
    chunkFilename: "[name].js"
  }
};
