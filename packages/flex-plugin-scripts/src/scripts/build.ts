import { logger, spawn } from 'flex-dev-utils';

import run, { exit } from '../utils/run';

/**
 * Builds the bundle
 */
const build = async (...args: string[]) => {
  logger.debug('Running build');

  // This prints a hosting instruction specific to react applications
  // We should replace it with instruction about Twilio Assets
  // hijack('react-dev-utils/printHostingInstructions', () => {
  //   // to be filled
  // });

  const spawnCmd = [
    require.resolve('.bin/craco'),
    'build',
  ];

  const { exitCode } = await spawn('node', spawnCmd.concat(args));
  exit(exitCode, args);
};

run(build);

export default build;
