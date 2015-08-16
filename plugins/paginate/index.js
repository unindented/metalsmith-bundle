'use strict';

import {debug, each, extend, match, omit, range} from '../../utils';

let log = debug('metalsmith:paginate');

const DEFAULTS = {
  pattern: '**/*'
};

export default function (options) {
  options = extend({}, DEFAULTS, options);

  let {pattern} = options;

  return function (files, metalsmith, done) {
    each(files, function (data, file) {
      let {collection, paginate} = data;

      let needsPagination =
        collection != null &&
        paginate != null &&
        collection.length > paginate;

      if (!match(file, pattern) || !needsPagination) {
        return;
      }

      let current = 0;
      let total = Math.ceil(collection.length / paginate);
      let pages = [data];

      extend(data, {
        current: current,
        total: total,
        pages: pages,
        collection: collection.slice(0, paginate)
      });

      each(range(current + 1, total), function (i) {
        let next = extend({}, data, {
          path: data.path.replace(/\/([^\/]+)$/, `/${i + 1}/$1`),
          current: i,
          total: total,
          collection: collection.slice(i * paginate, (i + 1) * paginate)
        });

        pages.push(next);

        log('adding page %s with attributes %o', next.path, omit(next, 'collection', 'pages'));
        files[next.path] = next;
      });
    });

    done();
  };
}
