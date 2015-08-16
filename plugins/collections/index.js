'use strict';

import {debug, each, extend, match} from '../../utils';

let log = debug('metalsmith:collections');

const DEFAULTS = {
};

export default function (options) {
  options = extend({}, DEFAULTS, options);

  return function (files, metalsmith, done) {
    let metadata = metalsmith.metadata();
    let collections = {};

    each(options, function (option, key) {
      let collection = collections[key];
      if (collection == null) {
        collections[key] = collection = [];
      }

      let {pattern, index, sortBy, reverse} = option;

      each(files, function (data, file) {
        if (!match(file, pattern)) {
          return;
        }

        log('adding %s to collection \'%s\'', file, key);
        collection.push(data);
      });

      // Keep on chooglin' if there's nothing to sort by.
      if (sortBy == null) {
        return;
      }

      let comparator = function (a, b) {
        a = a[sortBy];
        b = b[sortBy];

        let res = (a > b) ? 1 : (a < b) ? -1 : 0;
        return (reverse ? -1 : 1) * res;
      };

      log('sorting collection \'%s\' by field \'%s\'', key, sortBy);
      collection.sort(comparator);

      // Keep on chooglin' if we don't need to index.
      if (index == null) {
        return;
      }

      each(collection, function (item, i) {
        item.index = (i % index) + 1;
      });
    });

    metadata.collections = collections;

    done();
  };
}
