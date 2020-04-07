import { logger, env } from 'flex-dev-utils';
import { findPorts, getDefaultPort, getUrls } from 'flex-dev-utils/dist/urls';
import WebpackDevServer from 'webpack-dev-server';

import getConfiguration from '../config';

import run from '../utils/run';
import openBrowser from '../utils/browser';
import compiler from '../utils/compiler';
const termSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

/**
 * Starts the dev-server
 */
const start = async (...args: string[]) => {
  logger.debug('Starting local development environment');

  // Finds the first available free port where two consecutive ports are free
  const port = await findPorts(getDefaultPort(process.env.PORT));

  env.setBabelEnv('development');
  env.setNodeEnv('development');
  env.setHost('0.0.0.0');
  env.setPort(port);

  // Future node version will silently consume unhandled exception
  process.on('unhandledRejection', err => { throw err; });

  _startDevServer(port);
};

export const _startDevServer = (port: number) => {
  const config = getConfiguration('webpack', 'development');
  const devConfig = getConfiguration('devServer', 'development');
  const devCompiler = compiler(config, true);
  const devServer = new WebpackDevServer(devCompiler, devConfig);
  const { local } = getUrls(port);

  devServer.listen(local.port, local.host, async (err) => {
    if (err) {
      logger.error(err);
      return;
    }

    if (!env.isTerminalPersisted()) {
      logger.clearTerminal();
    }
    logger.notice('Starting development server...');

    await openBrowser(port);
  });

  termSignals.forEach((sig) => {
    process.on(sig, () => {
      devServer.close();
      process.exit();
    });
  });

  if (process.env.CI !== 'true') {
    process.stdin.on('end', () => {
      devServer.close();
      process.exit();
    });
    process.stdin.resume();
  }
};


run(start);

export default start;
