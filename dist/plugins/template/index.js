'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _consolidate = require('consolidate');

var _consolidate2 = _interopRequireDefault(_consolidate);

var _async = require('async');

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:template');

var DEFAULTS = {
  pattern: '**',
  directory: 'templates'
};

exports['default'] = function (options) {
  options = (0, _utils.extend)({}, DEFAULTS, options);

  var _options = options;
  var pattern = _options.pattern;
  var directory = _options.directory;
  var engine = _options.engine;

  var others = _objectWithoutProperties(_options, ['pattern', 'directory', 'engine']);

  var processor = _consolidate2['default'][engine];

  return function (files, metalsmith, done) {
    var metadata = metalsmith.metadata();

    var tasks = (0, _utils.map)(files, function (data, file) {
      return function (callback) {
        if (!(0, _utils.match)(file, pattern) || !data.template) {
          return callback();
        }

        var source = metalsmith.path(directory, data.template);
        var context = (0, _utils.extend)({}, others, metadata, data);
        var processed = function processed(err, contents) {
          if (err) {
            return callback(err);
          }

          data.contents = contents;
          callback();
        };

        log('rendering %s with %s', file, engine);
        processor(source, context, processed);
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