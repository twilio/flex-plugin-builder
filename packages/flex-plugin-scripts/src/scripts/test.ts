import { env, logger } from 'flex-dev-utils';
import { Environment } from 'flex-dev-utils/dist/env';
import { checkFilesExist, getPaths, addCWDNodeModule, resolveModulePath } from 'flex-dev-utils/dist/fs';
import { jestNotInstalled } from '../prints';

import run, { exit } from '../utils/run';

export const DEFAULT_JEST_ENV = 'jsdom';

/**
 * Validates that this is Jest test framework and that all dependencies are installed.
 * @private
 */
export const _validateJest = () => {
  if (!checkFilesExist(getPaths().app.jestConfigPath)) {
    return;
  }

  if (!resolveModulePath('jest')) {
    jestNotInstalled();
    exit(1);

    return;
  }
};

/**
 * Parses the args passed to the CLI
 * @param args  the args
 * @private
 */
export const _parseArgs = (...args: string[]) => {
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
const test = async (...args: string[]) => {
  logger.debug('Running tests');

  addCWDNodeModule();

  env.setNodeEnv(Environment.Test);
  env.setBabelEnv(Environment.Test);

  _validateJest();

  const { jestEnv, cleanArgs } = _parseArgs(...args);

  logger.clearTerminal();
  logger.notice('Running tests...');

  // We run this as a separate module here so that we don't have to import optional `jest` module if not needed
  require('./test/test').default(jestEnv, ...cleanArgs);
};

run(test);

export default test;
