import consolidate from 'consolidate'

import {parallel} from 'async'
import {debug, extend, map, match} from '../../utils'

let log = debug('metalsmith:template')

const DEFAULTS = {
  pattern: '**',
  directory: 'templates'
}

export default function (options) {
  options = extend({}, DEFAULTS, options)

  let {pattern, directory, engine, ...others} = options

  let processor = consolidate[engine]

  return function (files, metalsmith, done) {
    let metadata = metalsmith.metadata()

    let tasks = map(files, function (data, file) {
      return function (callback) {
        if (!match(file, pattern) || !data.template) {
          return callback()
        }

        let source = metalsmith.path(directory, data.template)
        let context = extend({}, others, metadata, data)
        let processed = function (err, contents) {
          if (err) {
            return callback(err)
          }

          data.contents = contents
          callback()
        }

        log('rendering %s with %s', file, engine)
        processor(source, context, processed)
      }
    })

    parallel(tasks, function (err) {
      if (err) {
        return done(err)
      }

      done()
    })
  }
}
