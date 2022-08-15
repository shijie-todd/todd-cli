const npmlog = require('npmlog')
const { LOG_MODE } = require('./constants')


npmlog.level = 'info'
function changeMode(mode) {
  if (mode === LOG_MODE.SILENT) {
    npmlog.level = 'silent'
  } else if (mode === LOG_MODE.DEBUG) {
    npmlog.level = 'verbose'
  } else {
    npmlog.level = 'info'
  }
}

npmlog.addLevel('debug', 1000, { fg: 'cyan' }, 'debug')
npmlog.addLevel('info', 2000, { fg: 'green' })
npmlog.addLevel('warn', 4000, { fg: 'yellow' }, 'warn')
npmlog.addLevel('error', 5000, { fg: 'red', bold: true }, 'error')
npmlog.addLevel('success', 5000, { fg: 'green', bold: true }, 'success')

const myLog = {
  debug: npmlog.debug,
  info: npmlog.info,
  warn: npmlog.warn,
  error: npmlog.error,
  success: npmlog.success,
  changeMode,
}

module.exports = myLog;
