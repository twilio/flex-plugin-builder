/* eslint-disable @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-require-imports */
import { Environment } from 'flex-dev-utils/dist/env';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { checkFilesExist, getPaths } from 'flex-dev-utils/dist/fs';
import {
  webpackFactory,
  webpackDevFactory,
  WebpackType,
  WebpackConfigurations,
  WebpackDevConfigurations,
  emitDevServerCrashed,
} from 'flex-plugin-webpack';

import jestFactory, { JestConfigurations } from './jest.config';

export { WebpackType };

export enum ConfigurationType {
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
 * @param type  the webpack type
 */
const getConfiguration = async <T extends ConfigurationType>(
  name: T,
  env: Environment,
  type: WebpackType = WebpackType.Complete,
): Promise<Configurations[T]> => {
  const args = {
    isProd: env === Environment.Production,
    isDev: env === Environment.Development,
    isTest: env === Environment.Test,
  };

  if (name === ConfigurationType.Webpack) {
    const config = webpackFactory(env, type);
    if (type === WebpackType.Static) {
      return config as Configurations[T];
    }

    if (checkFilesExist(getPaths().app.webpackConfigPath)) {
      try {
        return require(getPaths().app.webpackConfigPath)(config, args);
      } catch (exception) {
        await emitDevServerCrashed(exception);
      }
    }

    return config as Configurations[T];
  }

  if (name === ConfigurationType.DevServer) {
    const config = webpackDevFactory(type);

    if (type === WebpackType.Static) {
      return config as Configurations[T];
    }

    if (checkFilesExist(getPaths().app.devServerConfigPath)) {
      try {
        // Because I don't know how to pass webpack options to twilio-cli webpack dev server
        // when running flex:plugins:start
        // looks like webpack.dev.js & webpack.config.js are not took into account
        // or not well merged...
        config.disableHostCheck = true;
        return require(getPaths().app.devServerConfigPath)(config, args);
      } catch (exception) {
        await emitDevServerCrashed(exception);
      }
    }

    return config as Configurations[T];
  }

  if (name === ConfigurationType.Jest) {
    const config = jestFactory();

    if (checkFilesExist(getPaths().app.jestConfigPath)) {
      return require(getPaths().app.jestConfigPath)(config, args);
    }

    return config as Configurations[T];
  }

  throw new FlexPluginError('Unsupported configuration name');
};

export default getConfiguration;
