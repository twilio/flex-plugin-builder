const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 61,
      branches: 38,
      lines: 61,
      functions: 49,
    },
  },
};
