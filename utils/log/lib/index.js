'use strict';

const log = require('npmlog');

// add heading
log.heading = 'todd-cli'
log.headingStyle = {
  fg: 'black',
  bg: 'white',
  bold: true,
}

// set level
log.level = process.env.LOG_LEVEL ?? 'info';

// custom levels
log.addLevel('success', 2000, { fg: 'green' });

module.exports = log;
