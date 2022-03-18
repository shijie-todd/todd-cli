'use strict';

const os = require('os')

const semver = require('semver')
const colors = require('colors/safe')
const pathExists = require('path-exists').sync
const minimist = require('minimist')

const log = require('@todd-cli/log')

const pkg = require('../package.json')
const constants = require('./constants')

const argv = minimist(process.argv.slice(2))

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputParams()
  } catch (e) {
    log.error(e.message)
  }
}

function checkInputParams() {
  // set log level according to 'debug' parameter
  if (argv.debug) {
    process.env.LOG_LEVEL = process.env.LOG_LEVEL ?? constants.DEBUG_LEVEL;
  } else {
    process.env.LOG_LEVEL = process.env.LOG_LEVEL ?? constants.DEFAULT_LEVEL;
  }
  log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
  const homeDir = os.homedir()
  if(!homeDir || !pathExists(homeDir)) {
    throw new Error(colors.red('todd-cli needs a home directory.'))
  }
}

function checkRoot() {
  require('root-check')();
}

function checkNodeVersion() {
  const currentNodeVersion = process.version // process.versions.node
  const lowestNodeVersion = constants.LOWEST_NODE_VERSION
  if (semver.lt(currentNodeVersion, lowestNodeVersion)) {
    throw new Error(colors.red(`todd-cli needs Node.js ${lowestNodeVersion} or higher.`))
  }
}

function checkPkgVersion() {
  log.info('version', pkg.version)
}

module.exports = core;