module.exports = {
  collectCoverage: false,
  setupFiles: ['<rootDir>/jest.setup.js'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    '<rootDir>/packages/**/src/**/*.ts',
    '!<rootDir>/packages/**/src/**/*.d.ts',
    '!<rootDir>/packages/**/src/**/*.test.ts',
    '!<rootDir>/packages/**/src/index.ts',
    '!<rootDir>/packages/**/templates/**/*.ts',
    '!<rootDir>/packages/**/templates/**/*.js',
    '!<rootDir>/packages/**/templates/**/*.json',
    '!<rootDir>/packages/**/prints/**/*.ts',
    // TODO: Remove these
    '!<rootDir>/packages/flex-plugin-scripts/src/config/**/*.ts',
    '!<rootDir>/packages/flex-plugin-webpack/src/**/*.ts',
  ],
  testMatch: ['<rootDir>/packages/**/*.test.ts'],
  transform: {
    '^.+\\.js?$': '<rootDir>/node_modules/babel-jest',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  modulePathIgnorePatterns: ['<rootDir>/packages/create-flex-plugin/templates/'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
};
