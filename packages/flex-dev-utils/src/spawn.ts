import execa from 'execa';

import logger from './logger';
import { singleLineString } from './strings';

const DefaultOptions = { stdio: 'inherit' };
type ShellCmd = 'node' | 'yarn' | 'npm';

/**
 * A wrapper for spawn
 *
 * @param shellCmd  the shell command node vs yarn to use
 * @param args      the node script spawn
 * @param options   the spawn argument
 */
export const spawn = async (shellCmd: ShellCmd, args: string[], options: object = DefaultOptions) => {
  const spawnOptions = { ... { shell: process.env.SHELL }, ...options};

  try {
    const {
      signal,
      exitCode,
      exitCodeName,
      stdout,
      stderr,
    } = await execa(shellCmd, args, spawnOptions);

    if (signal === 'SIGKILL') {
      logger.error(singleLineString(
        'The script has failed because the process exited too early.',
        'This probably means the system ran out of memory or someone called ',
        '`kill -9` on the process.',
      ));
    } else if (signal === 'SIGTERM') {
      logger.warning(singleLineString(
        'The script has failed because the process exited too early.',
        'Someone might have called  `kill` or `killall`, or the system could',
        'be shutting down.',
      ));
    }

    return {
      exitCodeName,
      exitCode: exitCode || 0,
      stdout,
      stderr,
    };
  } catch (e) {
    return {
      exitCodeName: e.exitCodeName,
      exitCode: e.exitCode || 1,
      stderr: e.message,
      stdout: null,
    };
  }
};

export default spawn;
