import { logger, spawn } from 'flex-dev-utils';
import { join } from 'path';

import run, { exit } from '../utils/run';

/**
 * Starts the dev-server
 */
const start = async (...args: string[]) => {
  logger.debug('Running dev-server');

  // This will overwrite React App from opening the browser and allows us to control the flow
  process.env.BROWSER = join(__dirname, 'sub', 'browser.js');

  const spawnCmd = [
    require.resolve('.bin/craco'),
    'start',
  ];

  const { exitCode } = await spawn('node', spawnCmd.concat(args));
  exit(exitCode, args);
};

run(start);

export default start;
