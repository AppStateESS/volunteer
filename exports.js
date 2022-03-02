/* global __dirname, exports */
exports.path = require('path')
exports.APP_DIR = exports.path.resolve(__dirname, 'javascript')

exports.entry = {
  Sponsor: exports.APP_DIR + '/Sponsor/index.jsx',
  PunchIn: exports.APP_DIR + '/PunchIn/index.jsx',
  Kiosk: exports.APP_DIR + '/Kiosk/index.jsx',
  Unapproved: exports.APP_DIR + '/Unapproved/index.jsx',
  Settings: exports.APP_DIR + '/Settings/index.jsx',
  Volunteer: exports.APP_DIR + '/Volunteer/index.jsx',
  PunchListing: exports.APP_DIR + '/PunchListing/index.jsx',
  ReasonList: exports.APP_DIR + '/ReasonList/index.jsx',
  AssignReason: exports.APP_DIR + '/AssignReason/index.jsx',
  Waiting: exports.APP_DIR + '/Waiting/index.jsx',
  Email: exports.APP_DIR + '/Email/index.jsx',
}
