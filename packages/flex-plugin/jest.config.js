const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 97,
      branches: 81,
      lines: 97,
      functions: 100,
    },
  },
};
