const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 97,
      branches: 93,
      lines: 98,
      functions: 89,
    },
  },
};
