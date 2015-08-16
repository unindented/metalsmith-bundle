'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:path');

var DEFAULTS = {};

exports['default'] = function (options) {
  options = (0, _utils.extend)({}, DEFAULTS, options);

  var _options = options;
  var pattern = _options.pattern;

  return function (files, metalsmith, done) {
    (0, _utils.each)(files, function (data, file) {
      if (!(0, _utils.match)(file, pattern)) {
        return;
      }

      var path = file;

      log('extending %s with path \'%s\'', file, path);
      data.path = path;
    });

    done();
  };
};

module.exports = exports['default'];