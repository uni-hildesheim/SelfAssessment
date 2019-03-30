// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const config = require('./protractor.conf').config;

if (!('capabilities' in config)) {
  config['capabilities'] = {};
}

if (!('chromeOptions' in config['capabilities'])) {
  config['capabilities']['chromeOptions'] = {};
}

if (!('args' in config['capabilities']['chromeOptions'])) {
  config['capabilities']['chromeOptions']['args'] = [];
}

config['capabilities']['chromeOptions']['args'].push('--headless');

exports.config = config;