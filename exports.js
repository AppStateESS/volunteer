/* global __dirname, exports */
exports.path = require('path')
exports.APP_DIR = exports.path.resolve(__dirname, 'javascript')

exports.entry = {
  FirstScript: exports.APP_DIR + '/FirstScript/index.jsx',
}
