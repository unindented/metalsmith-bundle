import {debug, each, extend, match} from '../../utils'

let log = debug('metalsmith:move')

const DEFAULTS = {
  pattern: '**'
}

export default function (options) {
  options = extend({}, DEFAULTS, options)

  let {pattern} = options

  return function (files, metalsmith, done) {
    each(files, function (data, file) {
      if (!match(file, pattern) || !data.link) {
        return
      }

      // Remove leading slash, and add `index.html` if necessary.
      let dest = data.link.replace(/^\//, '').replace(/\/$/, '/index.html')

      log('moving %s to %s', file, dest)
      delete files[file]
      files[dest] = data
    })

    done()
  }
}
