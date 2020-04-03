import { logger } from 'flex-dev-utils';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getConfiguration from '../config';

import run from '../utils/run';
import openBrowser from './start/browser';
import { findPorts, getDefaultPort } from './start/server';

const termSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

/**
 * Starts the dev-server
 */
const start = async (...args: string[]) => {
  logger.debug('Starting local development environment');

  // Finds the first available free port where two consecutive ports are free
  const port = await findPorts(getDefaultPort(process.env.PORT));

  process.env.NODE_ENV = 'development';
  process.env.HOST = process.env.HOST || '0.0.0.0';
  process.env.PORT = port.toString();

  startDevServer(Number(process.env.PORT), process.env.HOST);
};

export const startDevServer = (port: number, host: string) => {
  const config = getConfiguration('webpack', 'development');
  const devConfig = getConfiguration('devServer', 'development');
  const devServer = new WebpackDevServer(webpack(config), devConfig);

  devServer.listen(port, host, async (err) => {
    if (err) {
      logger.error(err);
      return;
    }
    logger.clearTerminal();
    logger.info('Starting development server...');

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
