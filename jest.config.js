module.exports = {
  collectCoverage: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    '<rootDir>/packages/**/*.{js|ts}'
  ],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.test.{js|ts}'
  ],
  transform: {
    '^.+\\.js?$': '<rootDir>/node_modules/babel-jest'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/packages/create-flex-plugin/templates/*'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/packages/create-flex-plugin/templates/*'
  ]
};