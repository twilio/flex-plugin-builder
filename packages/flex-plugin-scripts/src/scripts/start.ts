import { logger } from 'flex-dev-utils';
import { join } from 'path';

import { resolve } from '../utils/require';
import run from '../utils/run';

// The craco start.js script path
export const cracoScriptPath = '@craco/craco/scripts/start.js';

/**
 * Starts the dev-server
 */
const start = () => {
  logger.debug('Running dev-server');

  // This will overwrite React App from opening the browser and allows us to control the flow
  process.env.BROWSER = join(__dirname, 'sub', 'browser.js');

  require(resolve(cracoScriptPath));
};

run(start);

export default start;
