const defaultOptions = {
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      lines: 100,
      functions: 100,
    },
  },
};

module.exports = (pkg, options) => {
  options = options || {};

  return {
    name: pkg.name,
    displayName: pkg.name,
    collectCoverage: false,
    coverageReporters: ['json', 'text'],
    coverageDirectory: '<rootDir>/../../coverage',
    collectCoverageFrom: [
      '<rootDir>/src/**/*.ts',
      '!<rootDir>/src/**/*.d.ts',
      '!<rootDir>/src/**/*.test.ts',
      '!<rootDir>/src/**/index.ts',
      '!<rootDir>/src/**/prints/**/*.ts',
    ],
    setupFiles: ['<rootDir>/../../jest.setup.js'],
    setupFilesAfterEnv: ['<rootDir>/../flex-plugin-utils-jest'],
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    transform: {
      '^.+\\.js?$': '<rootDir>/../../node_modules/babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
    testPathIgnorePatterns: ['/node_modules/', '<rootDir>/packages/flex-plugin-e2e-tests'],
    coveragePathIgnorePatterns: ['/node_modules/', 'jestTransforms'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json',
      },
    },
    ...defaultOptions,
    ...options,
  };
};
