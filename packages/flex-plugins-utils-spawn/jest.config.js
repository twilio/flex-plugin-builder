const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 97,
      branches: 83,
      lines: 96,
      functions: 100,
    },
  },
};
