import { logger } from 'flex-dev-utils';
import craco from '../utils/craco';

import run, { exit } from '../utils/run';

/**
 * Runs Jest tests
 */
const test = async (...args: string[]) => {
  logger.debug('Running tests');

  const exitCode = await craco('test', ...args);
  exit(exitCode, args);
};

run(test);

export default test;
