import { join } from 'path';

import { InitialOptions } from '@jest/types/build/Config';
import { checkFilesExist, getPaths } from 'flex-dev-utils/dist/fs';

interface RegexObject {
  [regex: string]: string;
}

export interface JestConfigurations extends Partial<InitialOptions> {
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

const defaultSetupFile = join(__dirname, '../templates/setupTests.js');

/**
 * Main method for generating a default Jest configuration
 */
export default (): JestConfigurations => {
  const paths = getPaths();
  const setupTestsFile = paths.app.setupTestsPaths.find((x: string) => checkFilesExist(x));

  return {
    roots: ['<rootDir>/src'],
    moduleDirectories: [
      'node_modules',
      paths.app.nodeModulesDir,
      paths.scripts.nodeModulesDir,
      paths.cli.nodeModulesDir,
    ],
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
    setupFiles: [require.resolve('react-app-polyfill/jsdom')],
    setupFilesAfterEnv: setupTestsFile ? [setupTestsFile] : [defaultSetupFile],
    testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
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
    moduleFileExtensions: [...getPaths().extensions, 'node'].filter((e) => !e.includes('mjs')),
    watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  };
};
