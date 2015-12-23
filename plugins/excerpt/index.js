import cheerio from 'cheerio'

import {debug, each, extend, match} from '../../utils'

let log = debug('metalsmith:excerpt')

const DEFAULTS = {
  pattern: '**/*.html',
  selector: 'p',
  start: 0,
  end: 1
}

export default function (options) {
  options = extend({}, DEFAULTS, options)

  let {pattern, selector, start, end} = options

  let processor = function (contents) {
    let $ = cheerio.load(contents)

    let text = function (i, el) {
      return $(el).text()
    }

    return $(selector).slice(start, end).map(text).get().join(' ')
  }

  return function (files, metalsmith, done) {
    each(files, function (data, file) {
      if (!match(file, pattern)) {
        return
      }

      let contents = data.contents.toString()
      let excerpt = processor(contents)

      log('extending %s with excerpt \'%s...\'', file, excerpt.substr(0, 32))
      data.excerpt = excerpt
    })

    done()
  }
}
