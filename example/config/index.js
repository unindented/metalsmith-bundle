import {readFileSync} from 'fs'
import {resolve} from 'path'
import {load} from 'js-yaml'

const contents = load(readFileSync(resolve(__dirname, 'config.yml'), 'utf8'))

export default function (config) {
  return contents[config] || contents.defaults
}
