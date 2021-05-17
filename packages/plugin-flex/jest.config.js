const base = require('./../../jest.base');
const pkg = require('./package');

pkg.name = 'plugin-flex';

module.exports = {
  rootDir: '.',
  ...base(pkg),
  globals: {
    'ts-jest': {
      tsconfig: `<rootDir>/tsconfig.json`,
    },
  },
  coverageThreshold: {
    global: {
      statements: 63,
      branches: 61,
      lines: 64,
      functions: 50,
    },
  },
};
