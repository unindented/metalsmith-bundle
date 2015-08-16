'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:collections');

var DEFAULTS = {};

exports['default'] = function (options) {
  options = (0, _utils.extend)({}, DEFAULTS, options);

  return function (files, metalsmith, done) {
    var metadata = metalsmith.metadata();
    var collections = {};

    (0, _utils.each)(options, function (option, key) {
      var collection = collections[key];
      if (collection == null) {
        collections[key] = collection = [];
      }

      var pattern = option.pattern;
      var index = option.index;
      var sortBy = option.sortBy;
      var reverse = option.reverse;

      (0, _utils.each)(files, function (data, file) {
        if (!(0, _utils.match)(file, pattern)) {
          return;
        }

        log('adding %s to collection \'%s\'', file, key);
        collection.push(data);
      });

      // Keep on chooglin' if there's nothing to sort by.
      if (sortBy == null) {
        return;
      }

      var comparator = function comparator(a, b) {
        a = a[sortBy];
        b = b[sortBy];

        var res = a > b ? 1 : a < b ? -1 : 0;
        return (reverse ? -1 : 1) * res;
      };

      log('sorting collection \'%s\' by field \'%s\'', key, sortBy);
      collection.sort(comparator);

      // Keep on chooglin' if we don't need to index.
      if (index == null) {
        return;
      }

      (0, _utils.each)(collection, function (item, i) {
        item.index = i % index + 1;
      });
    });

    metadata.collections = collections;

    done();
  };
};

module.exports = exports['default'];