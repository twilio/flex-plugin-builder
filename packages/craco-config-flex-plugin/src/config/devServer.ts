import path from 'path';
import { Configuration as DevConfig } from 'webpack-dev-server';
import merge from 'lodash.merge';

import { loadFile } from '../utils/fs';

export interface Configuration extends DevConfig {
  contentBase: string[];
}

/**
 * Configures the dev-server to run Flex plugin locally
 *
 * @param config  the {@link DevConfig}
 */
const configureDevServer = (config: DevConfig): Configuration => {
  const devAssets = path.join(process.cwd(), 'node_modules', 'flex-plugin', 'dev_assets');

  if (Array.isArray(config.contentBase)) {
    config.contentBase.push(devAssets);
  } else if (typeof(config.contentBase) === 'string') {
    config.contentBase = [
      config.contentBase,
      devAssets,
    ];
  } else {
    config.contentBase = [devAssets];
  }

  return config as Configuration;
};

export default (config: DevConfig): Configuration => {
  config = configureDevServer(config);

  // Now override if jest.config.js exists
  const webpackConfigOverride = loadFile(process.cwd(), 'webpack.config.js');
  if (webpackConfigOverride && webpackConfigOverride.devServer) {
    config = merge({}, config, webpackConfigOverride.devServer);
  }

  return config as Configuration;
};
