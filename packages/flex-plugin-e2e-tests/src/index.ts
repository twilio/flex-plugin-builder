/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/prefer-for-of, global-require */
import { readdirSync, existsSync, mkdirSync } from 'fs';

import { logger } from 'flex-plugins-utils-logger';

import { api, ConsoleAuthOptions } from './utils';

export interface TestParams {
  packageVersion: string;
  nodeVersion: string;
  homeDir: string;
  consoleBaseUrl: string;
  hostedFlexBaseUrl: string;
  secrets: {
    console: ConsoleAuthOptions;
  };
  plugin: {
    name: string;
    dir: string;
    componentText: string;
    baseUrl: string;
  } & Partial<TestParamsBuilder>;
}
interface TestParamsBuilder {
  newlineValue: string;
  changelog: string;
  version: string;
}

export interface TestSuite {
  description: string;
  (params: TestParams): Promise<void>;
}

const testSuites = readdirSync(`${__dirname}/tests`)
  .filter((f) => f.endsWith('.js'))
  .filter((f) => f.startsWith('step'))
  .sort((l, r) => {
    if (parseInt(l.split('step')[1], 10) > parseInt(r.split('step')[1], 10)) {
      return 1;
    }

    return -1;
  });

export const homeDir = `${process.env.HOME as string}/.local`;
const pluginName = 'flex-e2e-tester-plugin';
const testParams: TestParams = {
  packageVersion: process.env.PACKAGE_VERSION as string,
  nodeVersion: process.env.NODE_VERSION as string,
  consoleBaseUrl: process.env.CONSOLE_BASE_URL || 'https://www.twilio.com',
  hostedFlexBaseUrl: process.env.HOSTED_FLEX_BASE_URL || 'https://flex.twilio.com',
  homeDir,
  secrets: {
    console: {
      email: process.env.CONSOLE_EMAIL,
      password: process.env.CONSOLE_PASSWORD,
    },
  },
  plugin: {
    name: pluginName,
    dir: `${homeDir}/${pluginName}`,
    componentText: `This is a dismissible demo component ${Date.now()}`,
    baseUrl: 'http://localhost:3000' || (process.env.PLUGIN_BASE_URL as string),
  },
};

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

const runTest = async (step: number): Promise<void> => {
  // Makes the step have leading 0s
  const stepStr = '0'.repeat(Math.max(0, 3 - String(step).length)) + String(step);
  const testFile = `step${stepStr}`;
  const testSuite = require(`${__dirname}/tests/${testFile}`).default as TestSuite;

  logger.info(`Step ${stepStr} - ${testSuite.description}`);
  await testSuite(testParams);
};

(async () => {
  if (!existsSync(homeDir)) {
    mkdirSync(homeDir);
  }

  logger.info(`Running Plugins E2E Test with parameters:`);
  Object.keys(testParams).forEach(
    (key) => key !== 'secrets' && logger.info(`- ${key}: ${JSON.stringify(testParams[key])}`),
  );
  await api.cleanup();

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
})()
  .then(() => {
    logger.success('All E2E tests passed successfully');
  })
  .catch((e) => {
    logger.error('Failed to run E2E tests');
    logger.info(e);

    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
