module.exports = {
  collectCoverage: true,
  setupFiles: ['@babel/polyfill'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
  ],
  testMatch: [
    '<rootDir>/__tests__/**/*.test.ts'
  ],
  transform: {
    '^.+\\.js?$': 'babel-jest'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/templates/*'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/templates/*'
  ]
};
