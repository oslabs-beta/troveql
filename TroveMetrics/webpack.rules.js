module.exports = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.jsx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        exclude: /node_modules/,
        presets: ['@babel/preset-env', '@babel/preset-react'] //added '@babel/preset-env' - not sure if this is necessary after adding .babelrc file to this directory
      },
      options: {compact: false} //error without this (from chart.js I think): [BABEL] Note: The code generator has deoptimised the styling of /Users/erikajung/Codesmith/Senior/troveql/TroveMetrics/node_modules/react-dom/cjs/react-dom.development.js as it exceeds the max of 500KB.
    }
  },
  // Put your webpack loader rules in this array.  This is where you would put
  // your ts-loader configuration for instance:
   
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true
      }
    }
  }
   
];
