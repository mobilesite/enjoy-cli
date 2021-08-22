'use strict';

module.exports = core;

const log = require('@enjoy-cli/log');
const pkg = require('../package.json');

function core() {
  checkPkgVersion();
}

function checkPkgVersion() {
  console.log(pkg.version);
  log();
}
