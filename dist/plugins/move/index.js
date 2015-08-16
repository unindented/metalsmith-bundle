'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:move');

var DEFAULTS = {
  pattern: '**'
};

exports['default'] = function (options) {
  options = (0, _utils.extend)({}, DEFAULTS, options);

  var _options = options;
  var pattern = _options.pattern;

  return function (files, metalsmith, done) {
    (0, _utils.each)(files, function (data, file) {
      if (!(0, _utils.match)(file, pattern) || !data.link) {
        return;
      }

      // Remove leading slash, and add `index.html` if necessary.
      var dest = data.link.replace(/^\//, '').replace(/\/$/, '/index.html');

      log('moving %s to %s', file, dest);
      delete files[file];
      files[dest] = data;
    });

    done();
  };
};

module.exports = exports['default'];