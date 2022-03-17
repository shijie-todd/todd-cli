#!/usr/bin/env node

const importLocal = require('import-local')

if(importLocal(__filename)) {
  require('@todd-cli/log').info('cli', 'using local version of todd-cli')
} else {
  require('../lib')(process.argv.slice(2))
}
