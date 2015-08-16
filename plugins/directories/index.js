'use strict';

import {debug, each, extend, omit} from '../../utils';

let log = debug('metalsmith:directories');

const DEFAULTS = {
};

export default function (options) {
  options = extend({}, DEFAULTS, options);

  return function (files, metalsmith, done) {
    let metadata = metalsmith.metadata();
    let collections = metadata.collections;

    each(options, function (option) {
      let file = option.path;
      let {collection, max, ...others} = option;
      collection = collections[collection].slice(0, max);

      others = extend({}, others, {collection: collection});

      log('adding directory %s with attributes %o', file, omit(others, 'collection'));
      files[file] = others;
    });

    done();
  };
}
