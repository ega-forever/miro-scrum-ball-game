const path = require('path');

module.exports = {
  entry: {
    main: './src/index.ts',
    modal: './src/modal.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/
      },

    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  optimization: {
    // We no not want to minimize our code.
    minimize: false
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};
