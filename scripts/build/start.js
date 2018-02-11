const sh = require('shelljs');

sh.rm('-rf', __dirname + '/../../build/*');
sh.exec('webpack-dev-server --env.config=dev --watch --progress --hot --inline --port 8081');
