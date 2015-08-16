'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:link');

var DEFAULTS = {};

exports['default'] = function (options) {
  options = (0, _utils.extend)({}, DEFAULTS, options);

  return function (files, metalsmith, done) {
    var metadata = metalsmith.metadata();
    var url = metadata.global.url;

    (0, _utils.each)(options, function (option) {
      var pattern = option.pattern;
      var from = option.from;
      var to = option.to;

      (0, _utils.each)(files, function (data, file) {
        if (!(0, _utils.match)(file, pattern)) {
          return;
        }

        var link = file.replace(new RegExp(from), to);
        var permalink = '' + url + link;

        log('extending %s with link \'%s\'', file, link);
        data.link = link;
        data.permalink = permalink;
      });
    });

    done();
  };
};

module.exports = exports['default'];