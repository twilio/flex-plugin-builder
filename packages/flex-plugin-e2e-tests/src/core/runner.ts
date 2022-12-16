/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/prefer-for-of, global-require */
import * as fs from 'fs';

import rimraf from 'rimraf';
import packageJson from 'package-json';
import { logger } from '@twilio/flex-dev-utils';

import { homeDir, TestParams, TestScenario, TestSuite, testSuites } from '.';
import { api, sleep } from '../utils';

const RUN_TILL_STEP: number = 6;
const RUN_TS: string | undefined = process.env.TS;

/**
 * Main method for running a test
 * @param step the step to run
 * @param params the test params
 */
const runTest = async (step: number, params: TestParams): Promise<void> => {
  // Makes the step have leading 0s
  const stepStr = '0'.repeat(Math.max(0, 3 - String(step).length)) + String(step);
  const testFile = `step${stepStr}`;
  const testSuite = require(`${__dirname}/../tests/${testFile}`).default as TestSuite;

  logger.info(`Step ${stepStr} - ${testSuite.description} ..[${new Date().toISOString()}]..`);
  if (testSuite.before) {
    await testSuite.before(params);
  }
  await testSuite(params);
  if (testSuite.after) {
    await testSuite.after(params);
  }
};

/**
 * Prints contextual information
 * @param params the test params
 */
const printParameters = (params: TestParams) => {
  logger.info(`Running Plugins E2E Test with parameters:`);
  Object.keys(params)
    .filter((k) => !params[k].__hidden)
    .forEach((k) => {
      const p = { ...params[k] };
      delete p.__hidden;
      logger.info(`- ${k}: ${JSON.stringify(p, null, 2)}`);
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
 * Runs once before all tests
 * @param testParams the {@link TestParams} to use
 */
const beforeAll = async (testParams: TestParams) => {
  if (testParams.scenario.packageVersion === 'latest') {
    const pkg = await packageJson('@twilio/flex-plugin-scripts', { version: 'latest' });
    testParams.scenario.packageVersion = pkg.version as string;
  }
};

/**
 * Runs before the test
 */
const beforeEach = async (): Promise<void> =>
  new Promise(async (resolve, reject) => {
    logger.info('---- Before each ----');
    await sleep(10000);
    rimraf(homeDir, async (e) => {
      logger.info('--- Rimraf executed with result ----\n', e);
      if (e) {
        logger.error(e.message);
        reject(e.message);
      } else {
        logger.info('---- Creating directory ----');
        await fs.promises.mkdir(homeDir);
        await api.cleanup();
        resolve();
      }
    });
  });

/**
 * Runs all steps
 * @param testParams    the {@link TestParams}
 * @param testScenarios the {@link TestScenario}
 */
const runAll = async (testParams: TestParams, testScenarios: Partial<TestScenario>[]): Promise<void> => {
  for (const testScenario of testScenarios) {
    const params = { ...testParams };
    params.scenario = { ...params.scenario, ...testScenario };

    printParameters(params);
    await beforeEach();

    for (let i = 0; i < testSuites.length; i++) {
      if (i + 1 <= RUN_TILL_STEP) {
        await runTest(i + 1, params);
      } else {
        logger.info(`Skipping step ${i + 1}`);
      }
    }
  }
};

/**
 * Runs selected steps
 * @param testParams    the {@link TestParams}
 */
const runSelected = async (testParams: TestParams): Promise<void> => {
  const steps = getArgs('--step');
  const scenarios = getArgs('--scenario');
  const params = { ...testParams };
  for (const testScenario of scenarios) {
    params.scenario = { ...params.scenario, ...JSON.parse(testScenario) };
  }
  printParameters(params);

  for (let i = 0; i < steps.length; i++) {
    await runTest(parseInt(steps[i], 10), { ...params });
  }
};

/**
 * Starts the runner
 * @param testParams    the {@link TestParams} to use
 * @param testScenarios the {@link TestScenario} to test against
 */
const runner = async (testParams: TestParams, testScenarios: Partial<TestScenario>[]): Promise<void> => {
  const _testParams = { ...testParams };
  let _testScenario;

  // Needed for windows
  if (RUN_TS) {
    _testScenario = testScenarios.filter((s) => s.isTS === Boolean(RUN_TS));
  } else {
    _testScenario = [...testScenarios];
  }

  await beforeAll(_testParams);

  if (!process.argv.includes('--step')) {
    await runAll(_testParams, _testScenario);
    return;
  }

  await runSelected(_testParams);
};

export default runner;
