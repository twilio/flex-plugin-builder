import path from 'path';
import { Configuration as DevConfig } from 'webpack-dev-server';

export interface Configuration extends DevConfig {
  contentBase: string[];
}

const devServerConfig = (config: DevConfig): Configuration => {
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

export default devServerConfig;
