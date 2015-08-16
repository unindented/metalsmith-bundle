'use strict';

import browserify from 'browserify';

import {parallel} from 'async';
import {basename, extname} from 'path';
import {debug, extend, map, match} from '../../utils';

let log = debug('metalsmith:browserify');

const DEFAULTS = {
  pattern: '**/*.js'
};

export default function (options) {
  options = extend({}, DEFAULTS, options);

  let {pattern, ...others} = options;

  let processor = function (source, callback) {
    let buffer = '';
    let config = extend({
      standalone: basename(source, extname(source))
    }, others);

    let bundle = browserify(config).add(source).bundle();

    bundle.on('data', function (chunk) {
      buffer += chunk;
    });
    bundle.on('end', function () {
      callback(null, buffer);
    });
    bundle.on('error', function (err) {
      callback(err);
    });
  };

  return function (files, metalsmith, done) {
    let directory = metalsmith.source();

    let tasks = map(files, function (data, file) {
      return function (callback) {
        if (!match(file, pattern)) {
          return callback();
        }

        let source = metalsmith.path(directory, file);
        let processed = function (err, contents) {
          if (err) {
            return callback(err);
          }

          data.original = data.contents;
          data.contents = contents;
          callback();
        };

        log('browserifying %s', file);
        processor(source, processed);
      };
    });

    parallel(tasks, function (err) {
      if (err) {
        return done(err);
      }

      done();
    });
  };
}
