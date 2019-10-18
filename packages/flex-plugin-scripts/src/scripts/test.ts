import { logger, spawn } from 'flex-dev-utils';

import run, { exit } from '../utils/run';

/**
 * Runs Jest tests
 */
const test = async (...args: string[]) => {
  logger.debug('Running tests');

  const spawnCmd = [
    require.resolve('.bin/craco'),
    'test',
  ];

  const { exitCode } = await spawn('node', spawnCmd.concat(args));
  exit(exitCode, args);
};

run(test);

export default test;
