const base = require('./../../jest.base.js');
const pkg = require('./package');

module.exports = {
  rootDir: '.',
  ...base(pkg),
  testMatch: [`<rootDir>/src/**/*.test.ts`],
  testPathIgnorePatterns: ['<rootDir>/templates/*'],
  coveragePathIgnorePatterns: ['<rootDir>/templates/*'],
  modulePathIgnorePatterns: ['<rootDir>/templates/'],
};
