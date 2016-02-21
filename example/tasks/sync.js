import {spawn} from 'child_process'

export default function (config) {
  const src = config.sync.source
  const dst = config.sync.destination
  const opts = config.sync.options.concat(src, dst)

  spawn('rsync', opts, {stdio: 'inherit'})
}
