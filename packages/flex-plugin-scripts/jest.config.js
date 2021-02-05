const base = require('./../../tmp');
const pkg = require('./package');

const config = {
  rootDir: '.',
  ...base(pkg),
};

module.exports = config;
