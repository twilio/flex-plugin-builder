import { logger } from 'flex-dev-utils';
import { clearCredentials } from 'flex-dev-utils/dist/keytar';
import { progress } from 'flex-dev-utils/dist/ora';

import run from './run';

/**
 * Clears the environment
 * @param argv
 */
const clear = async (...argv: string[]) => {
  logger.info('Clearing caches and stored credentials');

  await progress('Removing stored credentials', async () => await clearCredentials());

  logger.newline();
  logger.info('✨  Successfully cleared all caches and stored credentials');
  logger.newline();
};

run(clear);

export default clear;
