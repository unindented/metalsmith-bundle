'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:directories');

var DEFAULTS = {};

exports['default'] = function (options) {
  options = (0, _utils.extend)({}, DEFAULTS, options);

  return function (files, metalsmith, done) {
    var metadata = metalsmith.metadata();
    var collections = metadata.collections;

    (0, _utils.each)(options, function (option) {
      var file = option.path;
      var collection = option.collection;
      var max = option.max;

      var others = _objectWithoutProperties(option, ['collection', 'max']);

      collection = collections[collection].slice(0, max);

      others = (0, _utils.extend)({}, others, { collection: collection });

      log('adding directory %s with attributes %o', file, (0, _utils.omit)(others, 'collection'));
      files[file] = others;
    });

    done();
  };
};

module.exports = exports['default'];