const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 97,
      branches: 70,
      lines: 96,
      functions: 96,
    },
  },
};
