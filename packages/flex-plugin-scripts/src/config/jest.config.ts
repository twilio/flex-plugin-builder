import { InitialOptions } from '@jest/types/build/Config';
import { paths } from 'flex-dev-utils';
import { checkFilesExist } from 'flex-dev-utils/dist/fs';

export interface JestConfigurations extends Partial<InitialOptions> {}

export default (): JestConfigurations => {
  const setupTestsFile = paths.app.setupTestsPaths.find(x => checkFilesExist(x));

  return {
    rootDir: paths.cwd,
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
    moduleFileExtensions: [...paths.extensions, 'node'].filter(e => !e.includes('mjs')),
    watchPlugins: [
      'jest-watch-typeahead/filename',
      'jest-watch-typeahead/testname',
    ],
  };
}
