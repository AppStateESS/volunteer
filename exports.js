/* global __dirname, exports */
exports.path = require('path')
exports.APP_DIR = exports.path.resolve(__dirname, 'javascript')

exports.entry = {
  Sponsor: exports.APP_DIR + '/Sponsor/index.jsx',
}
