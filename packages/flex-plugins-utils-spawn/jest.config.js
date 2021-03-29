const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 86,
      lines: 100,
      functions: 100,
    },
  },
};
