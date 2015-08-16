'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.build = build;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _metalsmith = require('metalsmith');

var _metalsmith2 = _interopRequireDefault(_metalsmith);

var _utils = require('./utils');

function build(config, callback) {
  // Create the processor.
  var metalsmith = new _metalsmith2['default'](process.cwd());

  // Basic configuration.
  (0, _utils.each)(['source', 'destination', 'metadata', 'clean'], function (key) {
    if (config[key] != null) {
      metalsmith[key](config[key]);
    }
  });

  // Plugin configuration.
  (0, _utils.each)(config.plugins, function (opts, plugin) {
    try {
      metalsmith.use(require('./plugins/' + plugin)(opts));
    } catch (err) {
      callback('failed to require plugin "' + plugin + '": ' + err.stack);
    }
  });

  // Build.
  metalsmith.build(function (err) {
    if (err) {
      return callback('failed to build: ' + err.stack);
    }

    callback(null, 'successfully built to ' + metalsmith.destination());
  });
}