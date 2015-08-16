'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:excerpt');

var DEFAULTS = {
  pattern: '**/*.html',
  selector: 'p',
  start: 0,
  end: 1
};

exports['default'] = function (options) {
  options = (0, _utils.extend)({}, DEFAULTS, options);

  var _options = options;
  var pattern = _options.pattern;
  var selector = _options.selector;
  var start = _options.start;
  var end = _options.end;

  var processor = function processor(contents) {
    var $ = _cheerio2['default'].load(contents);

    var text = function text(i, el) {
      return $(el).text();
    };

    return $(selector).slice(start, end).map(text).get().join(' ');
  };

  return function (files, metalsmith, done) {
    (0, _utils.each)(files, function (data, file) {
      if (!(0, _utils.match)(file, pattern)) {
        return;
      }

      var contents = data.contents.toString();
      var excerpt = processor(contents);

      log('extending %s with excerpt \'%s...\'', file, excerpt.substr(0, 32));
      data.excerpt = excerpt;
    });

    done();
  };
};

module.exports = exports['default'];