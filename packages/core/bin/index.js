#!/usr/bin/env node

const importLocal = require('import-local');

if (importLocal(__filename)) {
  return require('npmlog').info('todd-cli', 'use local version of todd-cli')
} else {
  return require('../lib')(process.argv.slice(2))
}