'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _cleanCss = require('clean-css');

var _cleanCss2 = _interopRequireDefault(_cleanCss);

var options = {
  advanced: false,
  keepSpecialComments: 0,
  roundingPrecision: 3
};

var minifier = new _cleanCss2['default'](options);

exports['default'] = function (contents, callback) {
  try {
    var result = minifier.minify(contents).styles;
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

module.exports = exports['default'];