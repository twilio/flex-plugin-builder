module.exports = {
  collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    '<rootDir>/packages/**/*.{js|ts}'
  ],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.{js|ts}'
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