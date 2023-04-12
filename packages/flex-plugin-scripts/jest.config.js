const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 94,
      branches: 88,
      lines: 94,
      functions: 92,
    },
  },
};
