'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _gaze = require('gaze');

var _browserSync = require('browser-sync');

var _browserSync2 = _interopRequireDefault(_browserSync);

var _path = require('path');

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:watch');

var DEFAULTS = {
  pattern: '**/*',
  mode: 'auto',
  debounce: 1000
};

exports['default'] = function (options) {
  options = (0, _utils.extend)({}, DEFAULTS, options);

  var _options = options;
  var source = _options.source;
  var pattern = _options.pattern;
  var delay = _options.delay;

  var others = _objectWithoutProperties(_options, ['source', 'pattern', 'delay']);

  var watcher = null;

  return function (files, metalsmith, done) {
    if (watcher != null) {
      return done();
    }

    var src = (0, _path.resolve)(source || metalsmith.source());
    var config = (0, _utils.extend)({ cwd: src }, others);

    watcher = new _gaze.Gaze(pattern, config);

    watcher.on('ready', function () {
      log('watching %s', src);

      done();
    });

    watcher.on('error', function (msg) {
      log('error %s', msg);
    });

    watcher.on('all', (0, _utils.debounce)(function (event, file) {
      log('%s was %s, rebuilding...', (0, _path.relative)(src, file), event);

      metalsmith.build(function (err) {
        if (err) {
          return log(err.message);
        }

        log('successfully rebuilt');

        _browserSync2['default'].reload();
      });
    }, delay));
  };
};

module.exports = exports['default'];