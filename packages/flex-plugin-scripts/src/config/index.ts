import { Environment } from 'flex-dev-utils/dist/env';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { checkFilesExist } from 'flex-dev-utils/dist/fs';
import { join } from 'path';
import { Configuration as WebpackConfigurations } from 'webpack';
import { Configuration as WebpackDevConfigurations } from 'webpack-dev-server';
import webpackFactory from './webpack.config';
import devFactory from './webpack.dev';

export enum ConfigurationType {
  Webpack = 'webpack',
  DevServer = 'devServer',
}
interface Configurations {
  webpack: WebpackConfigurations;
  devServer: WebpackDevConfigurations;
}

/**
 * Returns the configuration; if customer has provided a webpack.config.js, then the generated
 * config is passed to their Function for modification
 * @param name  the configuration name
 * @param env   the environment
 */
const getConfiguration = <C extends ConfigurationType>(name: ConfigurationType, env: Environment): Configurations[C] => {
  const pwd = process.cwd();
  const isProd = env === Environment.Production;
  const isDev = env === Environment.Development;

  if (name === ConfigurationType.Webpack) {
    const path = join(pwd, 'webpack.config.js');
    const config = webpackFactory(env);
    if (checkFilesExist(path)) {
      return require(path)(config, { isProd, isDev });
    }

    return config;
  }

  if (name === ConfigurationType.DevServer) {
    const path = join(pwd, 'webpack.dev.js');
    const config = devFactory();
    if (checkFilesExist(path)) {
      return require(path)(config, { isProd, isDev });
    }

    return config;
  }

  throw new FlexPluginError('Unsupported configuration name');
};

export default getConfiguration;
