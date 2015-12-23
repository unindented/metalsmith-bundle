import {debug, defaults, each, extend, match, reduce} from '../../utils'

let log = debug('metalsmith:extend')

const DEFAULTS = {
}

export default function (options) {
  options = extend({}, DEFAULTS, options)

  return function (files, metalsmith, done) {
    each(options, function (option) {
      let {pattern, attributes} = option

      each(files, function (data, file) {
        if (!match(file, pattern)) {
          return
        }

        let extension = reduce(attributes, function (memo, value, name) {
          if (value != null && value.from && value.to) {
            value = data[value.attribute].replace(new RegExp(value.from), value.to)
          }

          memo[name] = value
          return memo
        }, {})

        log('extending %s with %o', file, extension)
        defaults(data, extension)
      })
    })

    done()
  }
}
