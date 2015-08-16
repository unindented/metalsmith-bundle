'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:date');

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

      var date = new Date();

      log('extending %s with date \'%s\'', file, date);
      data.date = date;
    });

    done();
  };
};

module.exports = exports['default'];