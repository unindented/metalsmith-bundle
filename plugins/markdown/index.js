import hljs from 'highlight.js'
import markdown from 'markdown-it'
import mdabbr from 'markdown-it-abbr'
import mdcontainer from 'markdown-it-container'
import mddeflist from 'markdown-it-deflist'
import mdfootnote from 'markdown-it-footnote'
import mdins from 'markdown-it-ins'
import mdmark from 'markdown-it-mark'
import mdsub from 'markdown-it-sub'
import mdsup from 'markdown-it-sup'

import {parallel} from 'async'
import {basename, dirname, extname} from 'path'
import {debug, extend, map, match} from '../../utils'

let log = debug('metalsmith:markdown')

const DEFAULTS = {
  pattern: '**/*.+(md|markdown)',

  preset: 'default',

  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (err) {
        log('failed to highlight %s', lang)
      }
    }

    return str
  }
}

export default function (options) {
  options = extend({}, DEFAULTS, options)

  let {preset, pattern, ...others} = options

  let renderer = markdown(preset)
    .set(others)
    .use(mdabbr)
    .use(mdcontainer)
    .use(mddeflist)
    .use(mdfootnote)
    .use(mdins)
    .use(mdmark)
    .use(mdsub)
    .use(mdsup)

  let processor = function (contents, callback) {
    try {
      let results = renderer.render(contents)
      callback(null, results)
    } catch (err) {
      callback(err)
    }
  }

  return function (files, metalsmith, done) {
    let tasks = map(files, function (data, file) {
      return function (callback) {
        if (!match(file, pattern)) {
          return callback()
        }

        let dir = dirname(file)
        let ext = extname(file)
        let base = basename(file, ext)
        let dest = `${base}.html`

        if (dir !== '.') {
          dest = `${dir}/${dest}`
        }

        let contents = data.contents.toString()
        let processed = function (err, contents) {
          if (err) {
            return callback(err)
          }

          data.contents = contents

          delete files[file]
          files[dest] = data

          callback()
        }

        log('converting %s to %s', file, dest)
        processor(contents, processed)
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
