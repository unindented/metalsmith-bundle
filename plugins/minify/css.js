'use strict';

import CleanCss from 'clean-css';

const options = {
  advanced: false,
  keepSpecialComments: 0,
  roundingPrecision: 3
};

let minifier = new CleanCss(options);

export default function (contents, callback) {
  try {
    let result = minifier.minify(contents).styles;
    callback(null, result);
  } catch (err) {
    callback(err);
  }
}
