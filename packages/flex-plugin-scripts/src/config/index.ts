import { Environment } from 'flex-dev-utils/dist/env';
import paths from 'flex-dev-utils/dist/paths';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { checkFilesExist } from 'flex-dev-utils/dist/fs';
import { Configuration as WebpackConfigurations } from 'webpack';
import { Configuration as WebpackDevConfigurations } from 'webpack-dev-server';
import webpackFactory from './webpack.config';
import devFactory from './webpack.dev';
import jestFactory, { JestConfigurations } from './jest.config';

export enum ConfigurationType {
  WebpackInternal = 'webpackInternal',
  DevServerInternal = 'devServerInternal',
  Webpack = 'webpack',
  DevServer = 'devServer',
  Jest = 'jest',
}
interface Configurations {
  webpackInternal: WebpackConfigurations;
  devServerInternal: WebpackDevConfigurations;
  webpack: WebpackConfigurations;
  devServer: WebpackDevConfigurations;
  jest: JestConfigurations;
}

/**
 * Returns the configuration; if customer has provided a webpack.config.js, then the generated
 * config is passed to their Function for modification
 * @param name  the configuration name
 * @param env   the environment
 */
const getConfiguration = <T extends ConfigurationType>(name: T, env: Environment): Configurations[T] => {
  const args = {
    isProd: env === Environment.Production,
    isDev: env === Environment.Development,
    isTest: env === Environment.Test,
  };

  if (name === ConfigurationType.WebpackInternal) {
    return webpackFactory(env, true) as Configurations[T];
  }

  if (name === ConfigurationType.DevServerInternal) {
    return devFactory(true) as Configurations[T];
  }

  if (name === ConfigurationType.Webpack) {
    const config = webpackFactory(env, false);
    if (checkFilesExist(paths.app.webpackConfigPath)) {
      return require(paths.app.webpackConfigPath)(config, args);
    }

    return config as Configurations[T];
  }

  if (name === ConfigurationType.DevServer) {
    const config = devFactory(false);
    if (checkFilesExist(paths.app.devServerConfigPath)) {
      return require(paths.app.devServerConfigPath)(config, args);
    }

    return config as Configurations[T];
  }

  if (name === ConfigurationType.Jest) {
    const config = jestFactory();
    if (checkFilesExist(paths.app.jestConfigPath)) {
      return require(paths.app.jestConfigPath)(config, args);
    }

    return config as Configurations[T];
  }

  throw new FlexPluginError('Unsupported configuration name');
};

export default getConfiguration;
