'use strict';

const os = require('os')
const path = require('path')

const semver = require('semver')
const colors = require('colors/safe')
const pathExists = require('path-exists').sync
const minimist = require('minimist')
const dotenv = require('dotenv')

const log = require('@todd-cli/log')
const npmApi = require('@todd-cli/npm-api')

const pkg = require('../package.json')
const constants = require('./constants')

const homeDir = os.homedir()
const argv = minimist(process.argv.slice(2))

async function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputParams()
    checkEnvVariables()
    await checkGlobalUpdate()
  } catch (e) {
    log.error(e.message)
  }
}

async function checkGlobalUpdate() {
  const pkgName = pkg.name;
  const pkgVersion = pkg.version;
  const latestVersion = await npmApi.getPkgLatestVersion(pkgName, pkgVersion)
  if (latestVersion) {
    log.warn(colors.yellow(`Your ${pkgName} current version is ${pkgVersion}.`));
    log.warn(colors.yellow(`Please run 'npm i -g ${pkgName}' to get the latest version ${latestVersion}!`));
  }
}

function checkEnvVariables() {
  const dotenvPath = path.resolve(homeDir,'.env')
  if (pathExists(dotenvPath)) {
    dotenv.config({ path: dotenvPath })
  }
  createDefaultEnvConfig()
}

function createDefaultEnvConfig() {
  if (!process.env.CLI_HOME_PATH) {
    process.env.CLI_HOME_PATH = path.resolve(homeDir, constants.CLI_HOME_PATH)
  }
  log.verbose('cli_home', process.env.CLI_HOME_PATH)
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