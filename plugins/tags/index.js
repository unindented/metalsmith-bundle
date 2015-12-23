import {debug, each, extend, map, max, omit, pluck, reduce} from '../../utils'

let log = debug('metalsmith:tags')

const DEFAULTS = {
  weights: ['s', 'm', 'l']
}

export default function (options) {
  options = extend({}, DEFAULTS, options)

  let {index, individual, weights} = options

  return function (files, metalsmith, done) {
    var metadata = metalsmith.metadata()
    var collections = metadata.collections

    let tags = reduce(collections[index.collection], function (memo, data) {
      each(data.tags, function (tag) {
        if (memo[tag] == null) {
          memo[tag] = []
        }

        memo[tag].push(data)
      })

      return memo
    }, {})

    let biggest = max(pluck(tags, 'length'))

    log('adding index %s with attributes %o', index.path, omit(index, 'collection'))
    files[index.path] = index

    index.collection = map(tags, function (items, tag) {
      let slug = tag.toLowerCase().replace(/\s+/, '-')
      let title = tag.replace(/(.*)/, individual.title)
      let file = slug.replace(/(.*)/, individual.path)
      let weight = Math.round((weights.length - 1) * items.length / biggest)

      return extend({}, individual, {
        path: file,
        name: tag,
        title: title,
        collection: items,
        weight: weights[weight]
      })
    })

    let comparator = function (a, b) {
      a = a.name
      b = b.name

      return (a > b) ? 1 : (a < b) ? -1 : 0
    }

    log('sorting tags in index %s', index.path)
    index.collection.sort(comparator)

    each(index.collection, function (data) {
      log('adding tag %s with attributes %o', data.path, omit(data, 'collection'))
      files[data.path] = data
    })

    done()
  }
}
