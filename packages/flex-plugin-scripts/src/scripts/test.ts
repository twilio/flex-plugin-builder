import { logger } from 'flex-dev-utils';

import { runCraco } from '../utils/require';
import run from '../utils/run';

// The craco test.js script path
export const cracoScriptPath = '@craco/craco/scripts/test.js';

/**
 * Runs Jest tests
 */
const test = () => {
  logger.debug('Running tests');

  runCraco(cracoScriptPath);
};

run(test);

export default test;
