'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _browserSync = require('browser-sync');

var _browserSync2 = _interopRequireDefault(_browserSync);

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:serve');

var DEFAULTS = {
  port: 8000,
  open: false,
  logLevel: 'silent'
};

exports['default'] = function (options) {
  options = (0, _utils.extend)({}, DEFAULTS, options);

  return function (files, metalsmith, done) {
    if (_browserSync2['default'].active) {
      return done();
    }

    var dir = metalsmith.destination();

    var config = (0, _utils.extend)({
      server: { baseDir: dir }
    }, options);

    (0, _browserSync2['default'])(config, function (err) {
      if (err) {
        return done(err);
      }

      done();
    });

    _browserSync2['default'].emitter.on('service:running', function (data) {
      var urls = data.urls;

      log('serving files from %s', dir);
      log('local url: %s', urls.local);
      log('external url: %s', urls.external);
    });
  };
};

module.exports = exports['default'];