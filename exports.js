/* global __dirname, exports */
exports.path = require('path')
exports.APP_DIR = exports.path.resolve(__dirname, 'javascript')

exports.entry = {
  Sponsor: exports.APP_DIR + '/Sponsor/index.jsx',
  PunchIn: exports.APP_DIR + '/PunchIn/index.jsx',
  Report: exports.APP_DIR + '/Report/index.jsx',
  Settings: exports.APP_DIR + '/Settings/index.jsx',
  Volunteer: exports.APP_DIR + '/Volunteer/index.jsx',
  VolunteerReport: exports.APP_DIR + '/VolunteerReport/index.jsx',
}
