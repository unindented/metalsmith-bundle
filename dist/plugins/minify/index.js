'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _async = require('async');

var _path = require('path');

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:minify');

var DEFAULTS = {
  pattern: '**/*.+(css|html|js)'
};

exports['default'] = function (options) {
  options = (0, _utils.extend)({}, DEFAULTS, options);

  var _options = options;
  var pattern = _options.pattern;

  return function (files, metalsmith, done) {
    var tasks = (0, _utils.map)(files, function (data, file) {
      return function (callback) {
        if (!(0, _utils.match)(file, pattern)) {
          return callback();
        }

        var extension = (0, _path.extname)(file).substr(1);
        var contents = data.contents.toString();
        var processor = require('./' + extension);
        var processed = function processed(err, contents) {
          if (err) {
            return callback(err);
          }

          data.contents = contents;
          callback();
        };

        log('minifying %s', file);
        processor(contents, processed);
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