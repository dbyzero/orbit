const packageConf = require('../../package.json');
const sh = require('shelljs');

sh.sed('-i', '{{VERSION}}', packageConf.version, __dirname + '/../../build/index.html');
