import { logger } from 'flex-dev-utils';
import { join } from 'path';
import craco from '../utils/craco';

import run, { exit } from '../utils/run';
import { findPorts } from './start/server';

/**
 * Starts the dev-server
 */
const start = async (...args: string[]) => {
  logger.debug('Starting local development environment');

  // Finds the first available free port where two consecutive ports are free
  const port = await findPorts();
  process.env.PORT = port.toString();

  // This script runs after React Script is finished running
  process.env.BROWSER = join(__dirname, 'start', 'browser.js');

  const exitCode = await craco('start', ...args);
  exit(exitCode, args);
};

run(start);

export default start;
