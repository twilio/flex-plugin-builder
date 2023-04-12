const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  coverageThreshold: {
    global: {
      statements: 92,
      branches: 95,
      lines: 92,
      functions: 94,
    },
  },
};
