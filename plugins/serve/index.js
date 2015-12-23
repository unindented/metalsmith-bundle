import sync from 'browser-sync'

import {debug, extend} from '../../utils'

let log = debug('metalsmith:serve')

const DEFAULTS = {
  port: 8000,
  open: false,
  logLevel: 'silent'
}

export default function (options) {
  options = extend({}, DEFAULTS, options)

  return function (files, metalsmith, done) {
    if (sync.active) {
      return done()
    }

    let dir = metalsmith.destination()

    let config = extend({
      server: {baseDir: dir}
    }, options)

    sync(config, function (err) {
      if (err) {
        return done(err)
      }

      done()
    })

    sync.emitter.on('service:running', function (data) {
      let urls = data.urls

      log('serving files from %s', dir)
      log('local url: %s', urls.local)
      log('external url: %s', urls.external)
    })
  }
}
