import {debug, extend, each, match} from '../../utils'

let log = debug('metalsmith:ignore')

const DEFAULTS = {
}

export default function (options) {
  options = extend({}, DEFAULTS, options)

  let {patterns} = options

  return function (files, metalsmith, done) {
    each(files, function (data, file) {
      if (!match(file, patterns)) {
        return
      }

      log('ignoring %s', file)
      delete files[file]
    })

    done()
  }
}
