const base = require('./../../jest.config.base');
const pkg = require('./package');

pkg.name = 'plugin-flex';

module.exports = {
  ...base,
  name: pkg.name,
  displayName: pkg.name,
  rootDir: '../..',
  testMatch: [`<rootDir>/packages/${pkg.name}/**/*.test.ts`],
  globals: {
    'ts-jest': {
      tsconfig: `<rootDir>/packages/${pkg.name}/tsconfig.json`,
    },
  },
};
