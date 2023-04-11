const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 53,
      branches: 35,
      lines: 53,
      functions: 40,
    },
  },
};
