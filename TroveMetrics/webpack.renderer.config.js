const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

// possibly add rules for ts compiler here

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
