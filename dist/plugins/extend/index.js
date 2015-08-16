'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:extend');

var DEFAULTS = {};

exports['default'] = function (options) {
  options = (0, _utils.extend)({}, DEFAULTS, options);

  return function (files, metalsmith, done) {
    (0, _utils.each)(options, function (option) {
      var pattern = option.pattern;
      var attributes = option.attributes;

      (0, _utils.each)(files, function (data, file) {
        if (!(0, _utils.match)(file, pattern)) {
          return;
        }

        var extension = (0, _utils.reduce)(attributes, function (memo, value, name) {
          if (value != null && value.from && value.to) {
            value = data[value.attribute].replace(new RegExp(value.from), value.to);
          }

          memo[name] = value;
          return memo;
        }, {});

        log('extending %s with %o', file, extension);
        (0, _utils.defaults)(data, extension);
      });
    });

    done();
  };
};

module.exports = exports['default'];