import { InitialOptions } from '@jest/types/build/Config';
import { checkFilesExist, getPaths } from 'flex-dev-utils/dist/fs';

interface RegexObject {
  [regex: string]: string;
}

export interface JestConfigurations extends Partial<InitialOptions> {
  rootDir: string;
  roots: string[];
  collectCoverageFrom: string[];
  setupFiles: string[];
  setupFilesAfterEnv: string[];
  testMatch: string[];
  transform: RegexObject;
  transformIgnorePatterns: string[];
  moduleNameMapper: RegexObject;
  moduleFileExtensions: string[];
  watchPlugins: string[];
}

/**
 * Main method for generating a default Jest configuration
 */
export default (): JestConfigurations => {
  const setupTestsFile = getPaths().app.setupTestsPaths.find(x => checkFilesExist(x));

  return {
    rootDir: getPaths().cwd,
    roots: ['<rootDir>/src'],
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
    setupFiles: [
      require.resolve('react-app-polyfill/jsdom'),
    ],
    setupFilesAfterEnv: setupTestsFile ? [setupTestsFile] : [],
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    ],
    transform: {
      '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': require.resolve('./jestTransforms/babel'),
      '^.+\\.css$': require.resolve('./jestTransforms/css'),
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
      '^.+\\.module\\.(css|sass|scss)$',
    ],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
    },
    moduleFileExtensions: [...getPaths().extensions, 'node'].filter(e => !e.includes('mjs')),
    watchPlugins: [
      'jest-watch-typeahead/filename',
      'jest-watch-typeahead/testname',
    ],
  };
}
