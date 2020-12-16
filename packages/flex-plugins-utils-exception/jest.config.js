const base = require('./../../jest.config');
const pkg = require('./package');

module.exports = {
  ...base,
  name: pkg.name,
  displayName: pkg.name,
  rootDir: '../..',
  testMatch: [
    `<rootDir>/packages/${pkg.name}/**/*.test.ts`
  ],
};
