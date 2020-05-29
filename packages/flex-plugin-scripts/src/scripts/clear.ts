import { logger, progress } from 'flex-dev-utils';
import { clearCredentials } from 'flex-dev-utils/dist/credentials';

import run from '../utils/run';

/**
 * Clears the environment
 */
const clear = async () => {
  logger.info('Clearing caches and stored credentials');

  await progress('Removing stored credentials', async () => await clearCredentials());

  logger.newline();
  logger.info('✨  Successfully cleared all caches and stored credentials');
  logger.newline();
};

run(clear);

export default clear;
