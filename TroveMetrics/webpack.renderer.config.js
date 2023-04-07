const rules = require('./webpack.rules');

rules.push(
  {
    test: /\.s[ac]ss$/i,
    use: [
      // Creates `style` nodes from JS strings
      "style-loader",
      // Translates CSS into CommonJS
      "css-loader",
      // Compiles Sass to CSS
      "sass-loader",
    ],
  },
);

// possibly add rules for ts compiler here

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  devtool: 'cheap-module-source-map',
};
