const rules = require('./webpack.rules');

rules.push(
  {
    test: /\.s[ac]ss$/i,
    use: [
      // Creates 'style' nodes from JS strings
      "style-loader",
      // Translates CSS into CommonJS
      "css-loader",
      // Compiles Sass to CSS
      "sass-loader",
    ],
  },
);

module.exports = {
  // add webpack config file
  module: {
    rules,
  },
  devtool: 'cheap-module-source-map',
};
