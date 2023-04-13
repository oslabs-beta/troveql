module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.ts',
  // add webpack config file
  module: {
    rules: require('./webpack.rules'),
  },

  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts'],
  },
};
