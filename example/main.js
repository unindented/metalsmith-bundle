import debug from 'debug'
import parse from 'minimist'

import configs from './config'

// Parse arguments.
const argv = parse(process.argv.slice(2))
const task = argv._.shift()

// Get appropriate config.
const config = configs(process.env.CONFIG || task)

// Enable logging for certain namespaces.
const prefix = (name) => 'metalsmith:' + name
debug.enable(config.debug.map(prefix).join(','))

// Require the specified task.
const module = require('./tasks/' + task).default
module(config)
