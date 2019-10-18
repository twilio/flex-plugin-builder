import { logger } from 'flex-dev-utils';
import { join } from 'path';
import craco from '../utils/craco';

import run, { exit } from '../utils/run';

/**
 * Starts the dev-server
 */
const start = async (...args: string[]) => {
  logger.debug('Running dev-server');

  // This will overwrite React App from opening the browser and allows us to control the flow
  process.env.BROWSER = join(__dirname, 'sub', 'browser.js');

  const exitCode = await craco('start', ...args);
  exit(exitCode, args);
};

run(start);

export default start;
