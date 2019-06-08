const base = require('./../../jest.config.base');

module.exports = {
  ...base,
  rootDir: '../..',
  name: 'CracoConfigFlexPlugin',
  displayName: 'CracoConfigFlexPlugin',
  testPathIgnorePatterns: [
    '<rootDir>/packages/create-flex-plugin/templates/*'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/packages/create-flex-plugin/templates/*'
  ]
};
