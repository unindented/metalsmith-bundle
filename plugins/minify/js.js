'use strict';

import minifier from 'uglify-js';

const options = {
  fromString: true
};

export default function (contents, callback) {
  try {
    let result = minifier.minify(contents, options).code;
    callback(null, result);
  } catch (err) {
    callback(err);
  }
}
