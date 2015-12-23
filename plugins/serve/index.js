import sync from 'browser-sync'

import {debug, extend} from '../../utils'

let server = sync.create()
let log = debug('metalsmith:serve')

const DEFAULTS = {
  port: 8000,
  open: false,
  logLevel: 'silent'
}

export default function (options) {
  options = extend({}, DEFAULTS, options)

  return function (files, metalsmith, done) {
    if (server.active) {
      server.reload()
      return done()
    }

    let dir = metalsmith.destination()

    let config = extend({
      server: {baseDir: dir}
    }, options)

    server.init(config, function (err, bs) {
      if (err) {
        return done(err)
      }

      let urls = bs.getOption('urls')

      log('serving files from %s', dir)
      log('ui url: %s', urls.get('ui'))
      log('local url: %s', urls.get('local'))
      log('external url: %s', urls.get('external'))

      done()
    })
  }
}
