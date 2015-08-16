'use strict';

import Metalsmith from 'metalsmith';
import {each} from './utils';

export function build(config, callback) {
  // Create the processor.
  let metalsmith = new Metalsmith(process.cwd());

  // Basic configuration.
  each(['source', 'destination', 'metadata', 'clean'], function (key) {
    if (config[key] != null) {
      metalsmith[key](config[key]);
    }
  });

  // Plugin configuration.
  each(config.plugins, function (opts, plugin) {
    try {
      metalsmith.use(require(`./plugins/${plugin}`)(opts));
    } catch (err) {
      callback(`failed to require plugin "${plugin}": ${err.stack}`);
    }
  });

  // Build.
  metalsmith.build(function (err) {
    if (err) {
      return callback(`failed to build: ${err.stack}`);
    }

    callback(null, `successfully built to ${metalsmith.destination()}`);
  });
}
