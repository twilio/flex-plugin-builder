/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/prefer-for-of, global-require */
import { readdirSync, appendFileSync } from 'fs';

import { logger } from 'flex-plugins-utils-logger';
import spawn from './utils/spawn';


export interface TestParams {
  packageVersion: string;
  nodeVersion: string;
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
  packageVersion: process.env.PACKAGE_VERSION as string,
  nodeVersion: process.env.NODE_VERSION as string,
};

(async () => {
  logger.info(`Running Plugins E2E Test with parameters:`);
  Object.keys(testParams).forEach((key) => logger.info(`- ${key}: ${testParams[key]}`));
  if (process.env.CI === 'true') {
    await spawn('npm', 'set', 'prefix=/home/circleci/npm');
    appendFileSync('/home/circleci/.bashrc', "\'export PATH=$HOME/circleci/npm/bin:$PATH\'");
  }

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

    process.exit(1);
  });
