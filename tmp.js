const defaultOptions = {
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
};

module.exports = (pkg, options) => {
  options = options || {};

  return {
    name: pkg.name,
    displayName: pkg.name,
    collectCoverage: true,
    coverageReporters: ['json'],
    coverageDirectory: '<rootDir>/../../coverage',
    collectCoverageFrom: [`<rootDir>/src/**/*.ts`],
    setupFiles: ['<rootDir>/../../jest.setup.js'],
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    transform: {
      '^.+\\.js?$': '<rootDir>/../../node_modules/babel-jest',
    },
    testPathIgnorePatterns: ['/node_modules/'],
    coveragePathIgnorePatterns: ['/node_modules/'],
    ...defaultOptions,
    ...options,
  };
};
