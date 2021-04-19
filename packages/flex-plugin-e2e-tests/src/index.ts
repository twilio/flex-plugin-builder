/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/prefer-for-of, global-require */
import { readdirSync } from 'fs';

import { logger } from 'flex-plugins-utils-logger';

export interface TestParams {
  version: string;
}
export type TestSuite = (params: TestParams) => Promise<void>;

const testSuites = readdirSync(`${__dirname}/tests`)
  .filter((f) => f.endsWith('.js'))
  .filter((f) => f.startsWith('step'))
  .sort((l, r) => {
    if (parseInt(l.split('step')[1], 10) > parseInt(r.split('step')[1], 10)) {
      return 1;
    }

    return -1;
  });

const testParams: TestParams = {
  version: '',
};

(async () => {
  for (let i = 0; i < testSuites.length; i++) {
    await (require(`${__dirname}/tests/${testSuites[i]}`).default as TestSuite)(testParams);
  }
})()
  .then(() => {
    logger.success('All E2E tests passed successfully');
  })
  .catch((e) => {
    logger.error('Failed to run E2E tests');
    logger.info(e);
  });
