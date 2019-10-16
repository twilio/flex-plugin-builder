const base = require('./jest.config.base');

module.exports = {
  ...base,
  projects: [
    '<rootDir>/packages/*/jest.config.js'
  ],
  coverageDirectory: '<rootDir>/coverage/',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    }
  }
};
