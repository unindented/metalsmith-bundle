import {build} from '../..'
import {debug} from '../utils'

const log = debug('metalsmith:build')

export default function (config) {
  build(config, (error, success) => {
    if (error) {
      log(error)
      process.exit(1)
    }

    log(success)
  })
}
