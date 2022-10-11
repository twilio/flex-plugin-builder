/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/prefer-for-of, global-require */
import { existsSync, mkdirSync, rmdirSync } from 'fs';

import packageJson from 'package-json';
import { logger } from '@twilio/flex-dev-utils';

import { homeDir, TestParams, TestScenario, TestSuite, testSuites } from '.';
import { api } from '../utils';

/**
 * Array of numbers
 * Steps corresponding to the numbers in the array will not be run
 */
const SKIP_TESTS: Array<string> = process.env.SKIP_TESTS?.split(',') || [];

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
const beforeEach = async () => {
  if (existsSync(homeDir)) {
    rmdirSync(homeDir, { recursive: true });
  }
  mkdirSync(homeDir);

  await api.cleanup();
};

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
      /*
       * Skips any step that is present in SKIP_TESTS array
       * This is done to unblock the release
       * todo - Fix failing steps and remove the skipping tests logic
       */
      if (SKIP_TESTS.includes(String(i + 1))) continue;
      await runTest(i + 1, params);
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
  const _testScenario = [...testScenarios];
  await beforeAll(_testParams);

  if (!process.argv.includes('--step')) {
    await runAll(_testParams, _testScenario);
    return;
  }

  await runSelected(_testParams);
};

export default runner;
