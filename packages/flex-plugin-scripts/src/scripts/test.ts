import { env, logger, exit } from '@twilio/flex-dev-utils';
import { Environment } from '@twilio/flex-dev-utils/dist/env';
import { checkFilesExist, getPaths, addCWDNodeModule, resolveModulePath } from '@twilio/flex-dev-utils/dist/fs';

import { jestNotInstalled } from '../prints';
import run from '../utils/run';

export const DEFAULT_JEST_ENV = 'jsdom';

/**
 * Validates that this is Jest test framework and that all dependencies are installed.
 * @private
 */
export const _validateJest = (): void => {
  if (!checkFilesExist(getPaths().app.jestConfigPath)) {
    return;
  }

  if (!resolveModulePath('jest')) {
    jestNotInstalled();
    exit(1);
  }
};

/**
 * Parses the args passed to the CLI
 * @param args  the args
 * @private
 */
export const _parseArgs = (...args: string[]): { jestEnv: string; cleanArgs: string[] } => {
  const cleanArgs: string[] = [];
  let jestEnv = DEFAULT_JEST_ENV;
  let skipNext = false;

  args.forEach((arg, index) => {
    if (skipNext) {
      skipNext = false;
      return;
    }

    if (arg === '--env') {
      if (args[index + 1]) {
        jestEnv = args[index + 1];
        skipNext = true;
      }
      return;
    }

    if (arg.indexOf('--env=') === 0) {
      jestEnv = arg.substr('--env='.length);
      return;
    }
    cleanArgs.push(arg);
  });

  return { jestEnv, cleanArgs };
};

/**
 * Runs Jest tests
 */
const test = async (...args: string[]): Promise<void> => {
  logger.debug('Running tests');

  addCWDNodeModule();

  env.setNodeEnv(Environment.Test);
  env.setBabelEnv(Environment.Test);

  _validateJest();

  const { jestEnv, cleanArgs } = _parseArgs(...args);

  logger.clearTerminal();
  logger.notice('Running tests...');

  // We run this as a separate module here so that we don't have to import optional `jest` module if not needed
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-require-imports
  require('./test/test').default(jestEnv, ...cleanArgs);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(test);

// eslint-disable-next-line import/no-unused-modules
export default test;
