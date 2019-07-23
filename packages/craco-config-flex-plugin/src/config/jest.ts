import merge from 'lodash.merge';

import { loadFile } from '../utils/fs';

interface JestConfig {
  testPathIgnorePatterns?: string[];
}

interface Configuration extends JestConfig {
  testPathIgnorePatterns: string[];
}

interface Params {
  rootDir: string;
}

/**
 * Configuration override for Jest
 *
 * @param config    the config from create-react-app
 */
const configureJest = (config: JestConfig): Configuration => {
  config.testPathIgnorePatterns = [
    '/node_modules/',
  ];

  return config as Configuration;
};

export default {
  configure: (config: JestConfig, params: Params): Configuration => {
    config = configureJest(config);

    // Now override if jest.config.js exists
    const jestConfigOverride = loadFile(params.rootDir, 'jest.config.js');
    if (jestConfigOverride) {
      config = merge({}, config, jestConfigOverride);
    }

    return config as Configuration;
  },
};
