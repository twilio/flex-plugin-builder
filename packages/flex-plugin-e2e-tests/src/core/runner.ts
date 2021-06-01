/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/prefer-for-of, global-require */
import { existsSync, mkdirSync } from 'fs';

import { logger } from 'flex-plugins-utils-logger';

import { TestSuite, testSuites } from './suites';
import { homeDir, testParams } from './parameters';
import { api } from '../utils';

/**
 * Main method for running a test
 * @param step the step to run
 */
const runTest = async (step: number): Promise<void> => {
  // Makes the step have leading 0s
  const stepStr = '0'.repeat(Math.max(0, 3 - String(step).length)) + String(step);
  const testFile = `step${stepStr}`;
  const testSuite = require(`${__dirname}/../tests/${testFile}`).default as TestSuite;

  logger.info(`Step ${stepStr} - ${testSuite.description}`);
  if (testSuite.before) {
    await testSuite.before(testParams);
  }
  await testSuite(testParams);
  if (testSuite.after) {
    await testSuite.after(testParams);
  }
};

/**
 * Prints contextual information
 */
const printParameters = () => {
  logger.info(`Running Plugins E2E Test with parameters:`);
  Object.keys(testParams)
    .filter((k) => !testParams[k].__hidden)
    .forEach((k) => {
      const params = { ...testParams[k] };
      delete params.__hidden;
      logger.info(`- ${k}: ${JSON.stringify(params, null, 2)}`);
    });
};

/**
 * Converts the --step arg to steps
 */
const getArgs = (flag: string): string[] => {
  const _get = (...argv: string[]): string[] => {
    const index = argv.indexOf(flag);
    if (index === -1) {
      return [];
    }
    const arg = argv[index + 1];

    return [arg, ..._get(...argv.splice(index + 1))];
  };

  return _get(...process.argv);
};

/**
 * Runs before the test
 */
const beforeAll = async () => {
  if (!existsSync(homeDir)) {
    mkdirSync(homeDir);
  }

  await api.cleanup();
};

/**
 * Starts the runner
 */
const runner = async (): Promise<void> => {
  printParameters();
  await beforeAll();

  /*
   * We can run a particular step by provide --step 002
   * Otherwise we run all
   */
  if (!process.argv.includes('--step')) {
    for (let i = 0; i < testSuites.length; i++) {
      await runTest(i + 1);
    }
    return;
  }

  const steps = getArgs('--step');
  for (let i = 0; i < steps.length; i++) {
    await runTest(parseInt(steps[i], 10));
  }
};

export default runner;
