import { env, logger, open } from 'flex-dev-utils';
import { Environment } from 'flex-dev-utils/dist/env';
import { addCWDNodeModule } from 'flex-dev-utils/dist/require';
import { findPorts, getDefaultPort, getLocalAndNetworkUrls } from 'flex-dev-utils/dist/urls';
import WebpackDevServer from 'webpack-dev-server';

import getConfiguration, { ConfigurationType } from '../config';
import compiler from '../utils/compiler';

import run, { exit } from '../utils/run';
import pluginServer, { Plugin } from './start/pluginServer';
import webpackFlex from '../config/webpack.flex';

const termSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

/**
 * Starts the dev-server
 */
const startFlex = async (...args: string[]) => {
  logger.debug('Starting local development environment');

  addCWDNodeModule();

  // Finds the first available free port where two consecutive ports are free
  const port = await findPorts(getDefaultPort(process.env.PORT));

  env.setBabelEnv(Environment.Development);
  env.setNodeEnv(Environment.Development);
  env.setHost('0.0.0.0');
  env.setPort(port);

  // Future  node version will silently consume unhandled exception
  process.on('unhandledRejection', err => { throw err; });

  _startDevServer(port);
};

/**
 * Starts the webpack dev-server
 * @param port  the port the server is running on
 * @private
 */
/* istanbul ignore next */
export const _startDevServer = (port: number) => {
  const config = webpackFlex(Environment.Development);
  const devConfig = getConfiguration(ConfigurationType.DevServer, Environment.Development);
  const devCompiler = compiler(config, false);
  const devServer = new WebpackDevServer(devCompiler, devConfig);
  const { local } = getLocalAndNetworkUrls(port);

  // Start the dev-server
  devServer.listen(local.port, local.host, async (err) => {
    if (err) {
      logger.error(err);
      return;
    }

    logger.clearTerminal();
    logger.notice('Starting development server...');

    await pluginServer(port);
    await open(local.url);
  });

  // Close server and exit
  const cleanUp = () => {
    devServer.close();
    exit(0);
  };

  termSignals.forEach((sig) => process.on(sig, cleanUp));
  if (!env.isCI()) {
    process.stdin.on('end', cleanUp);
    process.stdin.resume();
  }
};

run(startFlex);

export default startFlex;