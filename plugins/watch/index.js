'use strict';

import {Gaze} from 'gaze';
import sync from 'browser-sync';

import {relative, resolve} from 'path';
import {debounce, debug, extend} from '../../utils';

let log = debug('metalsmith:watch');

const DEFAULTS = {
  pattern: '**/*',
  mode: 'auto',
  debounce: 1000
};

export default function (options) {
  options = extend({}, DEFAULTS, options);

  let {source, pattern, delay, ...others} = options;

  let watcher = null;

  return function (files, metalsmith, done) {
    if (watcher != null) {
      return done();
    }

    let src = resolve(source || metalsmith.source());
    let config = extend({cwd: src}, others);

    watcher = new Gaze(pattern, config);

    watcher.on('ready', function () {
      log('watching %s', src);

      done();
    });

    watcher.on('error', function (msg) {
      log('error %s', msg);
    });

    watcher.on('all', debounce(function (event, file) {
      log('%s was %s, rebuilding...', relative(src, file), event);

      metalsmith.build(function (err) {
        if (err) {
          return log(err.message);
        }

        log('successfully rebuilt');

        sync.reload();
      });
    }, delay));
  };
}
