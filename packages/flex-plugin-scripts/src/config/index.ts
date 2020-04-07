import { Environment } from 'flex-dev-utils/dist/env';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { checkFilesExist } from 'flex-dev-utils/dist/fs';
import { join } from 'path';
import { Configuration as WebpackConfigurations } from 'webpack';
import { Configuration as WebpackDevConfigurations } from 'webpack-dev-server';
import webpackFactory from './webpack.config';
import devFactory from './webpack.dev';

type ConfigurationTypes = 'webpack' | 'devServer';
interface Configurations {
  webpack: WebpackConfigurations;
  devServer: WebpackDevConfigurations;
}

const getConfiguration = <C extends ConfigurationTypes>(name: ConfigurationTypes, env: Environment): Configurations[C] => {
  const pwd = process.cwd();
  const path = join(pwd, 'webpack.config.js');
  const webpackConfig = webpackFactory(env);
  const devConfig = devFactory();

  const isProd = env === 'production';

  if (name === 'webpack') {
    // If this is dev-server, we'll return the devServer factory instead
    // if (checkFilesExist(path) && isProd) {
    //   return require(path)(webpackConfig);
    // }

    return webpackConfig;
  }

  if (name === 'devServer') {
    // const config = Object.assign({}, webpackConfig, devConfig);
    // if (checkFilesExist(path)) {
    //   return require(path)(config);
    // }

    return devConfig;
  }

  throw new FlexPluginError('Unsupported configuration name');
};

export default getConfiguration;
