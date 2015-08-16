'use strict';

import {parallel} from 'async';
import {extname} from 'path';
import {debug, extend, map, match} from '../../utils';

let log = debug('metalsmith:minify');

const DEFAULTS = {
  pattern: '**/*.+(css|html|js)'
};

export default function (options) {
  options = extend({}, DEFAULTS, options);

  let {pattern} = options;

  return function (files, metalsmith, done) {
    let tasks = map(files, function (data, file) {
      return function (callback) {
        if (!match(file, pattern)) {
          return callback();
        }

        let extension = extname(file).substr(1);
        let contents = data.contents.toString();
        let processor = require(`./${extension}`);
        let processed = function (err, contents) {
          if (err) {
            return callback(err);
          }

          data.contents = contents;
          callback();
        };

        log('minifying %s', file);
        processor(contents, processed);
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
