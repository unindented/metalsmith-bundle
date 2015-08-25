'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _highlightJs = require('highlight.js');

var _highlightJs2 = _interopRequireDefault(_highlightJs);

var _markdownIt = require('markdown-it');

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _markdownItAbbr = require('markdown-it-abbr');

var _markdownItAbbr2 = _interopRequireDefault(_markdownItAbbr);

var _markdownItContainer = require('markdown-it-container');

var _markdownItContainer2 = _interopRequireDefault(_markdownItContainer);

var _markdownItDeflist = require('markdown-it-deflist');

var _markdownItDeflist2 = _interopRequireDefault(_markdownItDeflist);

var _markdownItFootnote = require('markdown-it-footnote');

var _markdownItFootnote2 = _interopRequireDefault(_markdownItFootnote);

var _markdownItIns = require('markdown-it-ins');

var _markdownItIns2 = _interopRequireDefault(_markdownItIns);

var _markdownItMark = require('markdown-it-mark');

var _markdownItMark2 = _interopRequireDefault(_markdownItMark);

var _markdownItSub = require('markdown-it-sub');

var _markdownItSub2 = _interopRequireDefault(_markdownItSub);

var _markdownItSup = require('markdown-it-sup');

var _markdownItSup2 = _interopRequireDefault(_markdownItSup);

var _async = require('async');

var _path = require('path');

var _utils = require('../../utils');

var log = (0, _utils.debug)('metalsmith:markdown');

var DEFAULTS = {
  pattern: '**/*.+(md|markdown)',

  preset: 'default',

  highlight: function highlight(str, lang) {
    if (lang && _highlightJs2['default'].getLanguage(lang)) {
      try {
        return _highlightJs2['default'].highlight(lang, str).value;
      } catch (err) {
        log('failed to highlight %s', lang);
      }
    }

    return str;
  }
};

exports['default'] = function (options) {
  options = (0, _utils.extend)({}, DEFAULTS, options);

  var _options = options;
  var preset = _options.preset;
  var pattern = _options.pattern;

  var others = _objectWithoutProperties(_options, ['preset', 'pattern']);

  var renderer = (0, _markdownIt2['default'])(preset).set(others).use(_markdownItAbbr2['default']).use(_markdownItContainer2['default']).use(_markdownItDeflist2['default']).use(_markdownItFootnote2['default']).use(_markdownItIns2['default']).use(_markdownItMark2['default']).use(_markdownItSub2['default']).use(_markdownItSup2['default']);

  var processor = function processor(contents, callback) {
    try {
      var results = renderer.render(contents);
      callback(null, results);
    } catch (err) {
      callback(err);
    }
  };

  return function (files, metalsmith, done) {
    var tasks = (0, _utils.map)(files, function (data, file) {
      return function (callback) {
        if (!(0, _utils.match)(file, pattern)) {
          return callback();
        }

        var dir = (0, _path.dirname)(file);
        var ext = (0, _path.extname)(file);
        var base = (0, _path.basename)(file, ext);
        var dest = base + '.html';

        if (dir !== '.') {
          dest = dir + '/' + dest;
        }

        var contents = data.contents.toString();
        var processed = function processed(err, contents) {
          if (err) {
            return callback(err);
          }

          data.contents = contents;

          delete files[file];
          files[dest] = data;

          callback();
        };

        log('converting %s to %s', file, dest);
        processor(contents, processed);
      };
    });

    (0, _async.parallel)(tasks, function (err) {
      if (err) {
        return done(err);
      }

      done();
    });
  };
};

module.exports = exports['default'];