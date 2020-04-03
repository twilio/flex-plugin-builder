import { logger } from 'flex-dev-utils';

import run, { exit } from '../utils/run';

/**
 * Runs Jest tests
 */
const test = async (...args: string[]) => {
  logger.debug('Running tests');
};

run(test);

export default test;
