'use strict';

import {debug, extend, each, match} from '../../utils';

let log = debug('metalsmith:link');

const DEFAULTS = {
};

export default function (options) {
  options = extend({}, DEFAULTS, options);

  return function (files, metalsmith, done) {
    let metadata = metalsmith.metadata();
    let url = metadata.global.url;

    each(options, function (option) {
      let {pattern, from, to} = option;

      each(files, function (data, file) {
        if (!match(file, pattern)) {
          return;
        }

        let link = file.replace(new RegExp(from), to);
        let permalink = `${url}${link}`;

        log('extending %s with link \'%s\'', file, link);
        data.link = link;
        data.permalink = permalink;
      });
    });

    done();
  };
}
