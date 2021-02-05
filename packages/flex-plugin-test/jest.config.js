const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
};
