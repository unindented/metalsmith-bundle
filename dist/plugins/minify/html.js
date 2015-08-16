'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _htmlMinifier = require('html-minifier');

var _htmlMinifier2 = _interopRequireDefault(_htmlMinifier);

var options = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true
};

exports['default'] = function (contents, callback) {
  try {
    var result = _htmlMinifier2['default'].minify(contents, options);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

module.exports = exports['default'];