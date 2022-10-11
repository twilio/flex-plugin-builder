/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/prefer-for-of, global-require */
import { logger } from '@twilio/flex-dev-utils';

import { runner, testParams, testScenarios } from './core';

logger.info(`INIT: Invoking runner()`);
runner(testParams, testScenarios)
  .then(() => {
    logger.success('All E2E tests passed successfully');
  })
  .catch((e) => {
    logger.error('Failed to run E2E tests');
    logger.info(e);

    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
