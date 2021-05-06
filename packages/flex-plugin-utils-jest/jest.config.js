const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 83,
      lines: 94,
      functions: 85,
    },
  },
};
