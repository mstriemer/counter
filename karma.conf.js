// Karma configuration
// Generated on Sun Mar 06 2016 16:54:20 GMT-0600 (CST)

var webpackConfig = require('./webpack.config');

var newWebpackConfig = Object.assign({}, webpackConfig, {
  plugins: [],
  devtool: 'inline-source-map',
  output: undefined,
  entry: undefined,
});

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'test/runner.js'
    ],
    exclude: [
    ],
    preprocessors: {
      'test/runner.js': ['webpack', 'sourcemap'],
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Firefox'],
    singleRun: false,
    concurrency: Infinity,
    webpack: newWebpackConfig,
    webpackServer: {
      noInfo: true,
      quiet: true,
    },
  })
}
