import {debug, each, extend, match} from '../../utils'

let log = debug('metalsmith:date')

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

      let date = new Date()

      log('extending %s with date \'%s\'', file, date)
      data.date = date
    })

    done()
  }
}
