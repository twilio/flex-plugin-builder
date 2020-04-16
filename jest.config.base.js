module.exports = {
  collectCoverage: false,
  setupFiles: [
    '<rootDir>/jest.setup.js'
  ],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    '<rootDir>/packages/**/src/**/*.ts',
    '!<rootDir>/packages/**/src/**/*.d.ts',
    '!<rootDir>/packages/**/src/**/*.test.ts',
    '!<rootDir>/packages/**/src/index.ts',
    '!<rootDir>/packages/**/templates/**/*.ts',
    '!<rootDir>/packages/**/prints/**/*.ts',
    '!<rootDir>/packages/flex-plugin-scripts/src/config/jestTransforms/*.ts',
    '!<rootDir>/packages/flex-plugin-scripts/src/config/webpack/*.ts',
  ],
  testMatch: [
    '<rootDir>/packages/**/*.test.ts'
  ],
  transform: {
    '^.+\\.js?$': '<rootDir>/node_modules/babel-jest'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/packages/create-flex-plugin/templates/'
  ]
};
