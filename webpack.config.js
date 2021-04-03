const path = require('path');


module.exports = (env)=> {

  const envs = {
    prod: require('./config/prod.json'),
    dev: require('./config/dev.json')
  }

  return {
    entry: {
      main: './src/index.ts',
      modal: './src/modal.ts',
      success: './src/success.ts'
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
        {
          test: /\.svg/,
          type: 'asset/source'
        },
        {
          test: /\.ts$/,
          loader: 'string-replace-loader',
          options: {
            multiple: [
              { search: '<app_id>', replace: envs[env.ENVIRONMENT].app_id }
            ]
          }
        }
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
  }
};
