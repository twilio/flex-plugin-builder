/* eslint-disable @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-require-imports */
import { Environment } from '@twilio/flex-dev-utils/dist/env';
import { FlexPluginError } from '@twilio/flex-dev-utils/dist/errors';
import { checkFilesExist, getPaths } from '@twilio/flex-dev-utils/dist/fs';
import {
  webpackFactory,
  webpackDevFactory,
  WebpackType,
  WebpackConfigurations,
  WebpackDevConfigurations,
  emitDevServerCrashed,
} from '@twilio/flex-plugin-webpack';
import {
  webpackFactoryWp5,
  webpackDevFactoryWp5,
  WebpackTypeWp5,
  WebpackConfigurationsWp5,
  WebpackDevConfigurationsWp5,
  emitDevServerCrashedWp5,
} from '@twilio/flex-plugin-webpack5';

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

interface ConfigurationsWp5 {
  webpackInternal: WebpackConfigurationsWp5;
  devServerInternal: WebpackDevConfigurationsWp5;
  webpack: WebpackConfigurationsWp5;
  devServer: WebpackDevConfigurationsWp5;
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
  emitErrors: boolean,
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
        if (emitErrors) {
          await emitDevServerCrashed(exception);
        } else {
          throw exception;
        }
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

export const getConfigurationForWp5 = async <T extends ConfigurationType>(
  name: T,
  env: Environment,
  emitErrors: boolean,
  type: WebpackTypeWp5 = WebpackTypeWp5.Complete,
): Promise<ConfigurationsWp5[T]> => {
  const args = {
    isProd: env === Environment.Production,
    isDev: env === Environment.Development,
    isTest: env === Environment.Test,
  };

  if (name === ConfigurationType.Webpack) {
    const config = webpackFactoryWp5(env, type);
    if (type === WebpackTypeWp5.Static) {
      return config as ConfigurationsWp5[T];
    }

    if (checkFilesExist(getPaths().app.webpackConfigPath)) {
      try {
        return require(getPaths().app.webpackConfigPath)(config, args);
      } catch (exception) {
        if (emitErrors) {
          await emitDevServerCrashedWp5(exception);
        } else {
          throw exception;
        }
      }
    }

    return config as ConfigurationsWp5[T];
  }

  if (name === ConfigurationType.DevServer) {
    const config = webpackDevFactoryWp5(type);

    if (type === WebpackTypeWp5.Static) {
      return config as ConfigurationsWp5[T];
    }

    if (checkFilesExist(getPaths().app.devServerConfigPath)) {
      try {
        return require(getPaths().app.devServerConfigPath)(config, args);
      } catch (exception) {
        await emitDevServerCrashedWp5(exception);
      }
    }

    return config as ConfigurationsWp5[T];
  }

  if (name === ConfigurationType.Jest) {
    const config = jestFactory();

    if (checkFilesExist(getPaths().app.jestConfigPath)) {
      return require(getPaths().app.jestConfigPath)(config, args);
    }

    return config as ConfigurationsWp5[T];
  }

  throw new FlexPluginError('Unsupported configuration name');
};

export default getConfiguration;
