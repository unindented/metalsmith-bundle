export * from 'lodash'

export debug from 'debug'

import multimatch from 'multimatch'
export function match (file, pattern) {
  return (multimatch(file, pattern, {dot: true})[0] != null)
}
