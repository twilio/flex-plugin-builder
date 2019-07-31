import { logger } from 'flex-dev-utils';

import { resolve } from '../utils/require';
import run from '../utils/run';

// The craco test.js script path
export const cracoScriptPath = '@craco/craco/scripts/test.js';

/**
 * Runs Jest tests
 */
const test = () => {
  logger.debug('Running tests');

  require(resolve(cracoScriptPath));
};

run(test);

export default test;
