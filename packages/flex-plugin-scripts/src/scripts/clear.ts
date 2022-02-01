import { logger, progress } from '@twilio/flex-dev-utils';
import { clearCredentials } from '@twilio/flex-dev-utils/dist/credentials';

import run from '../utils/run';

/**
 * Clears the environment
 */
const clear = async (): Promise<void> => {
  logger.info('Clearing caches and stored credentials');

  await progress('Removing stored credentials', async () => clearCredentials());

  logger.newline();
  logger.info('✨  Successfully cleared all caches and stored credentials');
  logger.newline();
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(clear);

// eslint-disable-next-line import/no-unused-modules
export default clear;
