#! /usr/bin/env node

const importLocal = require('import-local');
console.log('Hi, enjoy-cli!');

if (importLocal(__filename)) {
  // 如果本地node_modules存在@enjoy-cli/core的情况下，会走这个分支
  require('npmlog').info('cli', '正在使用enjoy-cli的本地版本');
} else {
  require('../lib')(process.argv.slice(2));
}
