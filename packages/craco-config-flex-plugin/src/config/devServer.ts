import path from 'path';
import { Configuration } from 'webpack-dev-server';

const devServerConfig = (config: Configuration) => {
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

  return config;
};

export default devServerConfig;
