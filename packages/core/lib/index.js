const fs = require('fs');
const os = require('os');
const path = require('path');
const semver = require('semver')

const { logger, constants } = require('@todd-cli/utils')

const pkg = require('../package.json')

const { LOG_MODE, LOWEST_NODE_VERSION, DEFAULT_CLI_HOME } = constants

module.exports = main;

function main(argv) {
  try {
    prepare(argv)
  } catch (e){
    logger.error('cli', e.message)
  }
}

function prepare(argv) {
  checkLogMode(argv) // 先调用是为了打 debug 日志
  checkPkgVersion()
  checkNodeVersion()
  checkRoot()
  checkUserHome()
  checkEnv()
}

function checkPkgVersion() {
  logger.info('cli version', pkg.version)
}

function checkNodeVersion() {
  logger.debug('node version', process.version)
  if (semver.lt(process.version, LOWEST_NODE_VERSION)) {
    throw new Error(`todd-cli需要安装v${LOWEST_NODE_VERSION}以上版本的NodeJS，请检查node版本！`)
  }
}

function checkRoot() {
  // downgrade root permission
  const rootCheck = require('root-check')
  rootCheck()
}

function checkUserHome() {
  const userHome = os.homedir()
  logger.debug('userHome', userHome)
  if (!userHome || !fs.existsSync(userHome)) {
    throw new Error ('当前登录用户，用户主目录不存在！')
  }
}

function checkLogMode(argv) {
  const minimist = require('minimist')
  const arguments = minimist(argv)
  if (arguments[LOG_MODE.SILENT]){
    logger.changeMode(LOG_MODE.SILENT)
  } else if (arguments[LOG_MODE.DEBUG]) {
    logger.changeMode(LOG_MODE.DEBUG)
    logger.debug('arguments', arguments)
  }
}

function checkEnv() {
  const dotenv = require('dotenv')
  console.log(process.cwd())
}