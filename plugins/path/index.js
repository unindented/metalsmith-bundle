import {debug, each, extend, match} from '../../utils'

let log = debug('metalsmith:path')

const DEFAULTS = {
}

export default function (options) {
  options = extend({}, DEFAULTS, options)

  let {pattern} = options

  return function (files, metalsmith, done) {
    each(files, function (data, file) {
      if (!match(file, pattern)) {
        return
      }

      let path = file

      log('extending %s with path \'%s\'', file, path)
      data.path = path
    })

    done()
  }
}
