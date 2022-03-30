const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 94,
      lines: 98,
      functions: 98,
    },
  },
};
