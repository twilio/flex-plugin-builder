const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 100,
      lines: 100,
      functions: 94,
    },
  },
};
