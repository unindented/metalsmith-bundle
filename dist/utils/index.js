'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.match = match;

function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _multimatch = require('multimatch');

var _multimatch2 = _interopRequireDefault(_multimatch);

var _lodash = require('lodash');

_defaults(exports, _interopExportWildcard(_lodash, _defaults));

var _debug = require('debug');

exports.debug = _interopRequire(_debug);

function match(file, pattern) {
  return (0, _multimatch2['default'])(file, pattern, { dot: true })[0] != null;
}