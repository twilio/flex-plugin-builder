import * as path from 'path';
import {Configuration} from 'webpack-dev-server';

const devServerConfig = (config: Configuration) => {
  const paths = path.join(process.cwd(), 'node_modules', 'flex-plugin', 'dev_assets');

  if (Array.isArray(config.contentBase)) {
    config.contentBase.push(paths)
  } else if (typeof(config.contentBase) === 'string') {
    config.contentBase = [
      config.contentBase,
      paths
    ];
  } else {
    config.contentBase = [paths];
  }

  return config;
};

export default devServerConfig;
