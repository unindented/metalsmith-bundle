'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _browserify = require('browserify');

var _browserify2 = _interopRequireDefault(_browserify);

var _async = require('async');

var _path = require('path');

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:browserify');

var DEFAULTS = {
  pattern: '**/*.js'
};

exports['default'] = function (options) {
  options = (0, _utils.extend)({}, DEFAULTS, options);

  var _options = options;
  var pattern = _options.pattern;

  var others = _objectWithoutProperties(_options, ['pattern']);

  var processor = function processor(source, callback) {
    var buffer = '';
    var config = (0, _utils.extend)({
      standalone: (0, _path.basename)(source, (0, _path.extname)(source))
    }, others);

    var bundle = (0, _browserify2['default'])(config).add(source).bundle();

    bundle.on('data', function (chunk) {
      buffer += chunk;
    });
    bundle.on('end', function () {
      callback(null, buffer);
    });
    bundle.on('error', function (err) {
      callback(err);
    });
  };

  return function (files, metalsmith, done) {
    var directory = metalsmith.source();

    var tasks = (0, _utils.map)(files, function (data, file) {
      return function (callback) {
        if (!(0, _utils.match)(file, pattern)) {
          return callback();
        }

        var source = metalsmith.path(directory, file);
        var processed = function processed(err, contents) {
          if (err) {
            return callback(err);
          }

          data.original = data.contents;
          data.contents = contents;
          callback();
        };

        log('browserifying %s', file);
        processor(source, processed);
      };
    });

    (0, _async.parallel)(tasks, function (err) {
      if (err) {
        return done(err);
      }

      done();
    });
  };
};

module.exports = exports['default'];