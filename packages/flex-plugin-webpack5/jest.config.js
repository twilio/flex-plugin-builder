const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 61,
      branches: 35,
      lines: 58,
      functions: 49,
    },
  },
};
