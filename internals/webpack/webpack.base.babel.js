/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const os = require('os');
const HappyPack = require('happypack');

const tempDir = path.resolve(__dirname, '..', '.happypack');
const threadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const HAPPYPACK_DEFAULTS = {
  cacheContext: {
    env: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  },
  tempDir,
  threadPool,
  verboseWhenProfiling: true,
  verbose: true,
};


var HappyPackLoader = (id, loaders) =>
  new HappyPack(Object.assign({ id, loaders }, HAPPYPACK_DEFAULTS));



module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    rules: [
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: 'happypack/loader?id=jsx',
        },
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: {
          loader: 'happypack/loader?id=css',
        },
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: {
          loader: 'happypack/loader?id=css',
        },
      },
      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        use: {
          loader: 'happypack/loader?id=file',
        },
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: {
          loader: 'happypack/loader?id=html',
        },
      },
      {
        test: /\.json$/,
        use: {
          loader: 'happypack/loader?id=json',
        },
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'happypack/loader?id=url',
        },
      },
    ],
  },
  plugins: options.plugins.concat([
    HappyPackLoader('jsx', [{
      loader: 'babel-loader',
      options: Object.assign(options.babelQuery || {}, {
        cacheDirectory: true,
      }),
    }]),
    HappyPackLoader('css', [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader',
    }]),
    HappyPackLoader('file', [{
      loader: 'file-loader',
    }]),
    HappyPackLoader('html', [{
      loader: 'html-loader',
    }]),
    HappyPackLoader('json', [{
      loader: 'json-loader',
    }]),
    HappyPackLoader('url', [{
      loader: 'url-loader',
      options: {
        limit: 10000,
      },
    }]),
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.NamedModulesPlugin(),
  ]),
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
});
