'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _uglifyJs = require('uglify-js');

var _uglifyJs2 = _interopRequireDefault(_uglifyJs);

var options = {
  fromString: true
};

exports['default'] = function (contents, callback) {
  try {
    var result = _uglifyJs2['default'].minify(contents, options).code;
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

module.exports = exports['default'];