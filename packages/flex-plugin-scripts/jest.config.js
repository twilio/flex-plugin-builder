const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 88,
      lines: 96,
      functions: 93,
    },
  },
};
