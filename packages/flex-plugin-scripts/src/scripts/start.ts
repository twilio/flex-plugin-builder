import { logger } from 'flex-dev-utils';

import { resolve } from '../utils/require';
import run from '../utils/run';

// The craco start.js script path
export const cracoScriptPath = '@craco/craco/scripts/start.js';

/**
 * Starts the dev-server
 */
const start = () => {
  logger.debug('Running dev-server');

  require(resolve(cracoScriptPath));
};

run(start);

export default start;
