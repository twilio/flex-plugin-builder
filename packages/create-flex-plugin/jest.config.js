const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  testMatch: [`<rootDir>/src/**/*.test.ts`],
  testPathIgnorePatterns: ['<rootDir>/templates/*'],
  coveragePathIgnorePatterns: ['<rootDir>/templates/*'],
  modulePathIgnorePatterns: ['<rootDir>/templates/'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 98,
      lines: 100,
      functions: 100,
    },
  },
};
