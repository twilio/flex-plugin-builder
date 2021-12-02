/* eslint-disable import/no-unused-modules, @typescript-eslint/ban-types, @typescript-eslint/promise-function-async */
import os from 'os';

import execa from 'execa';

import { logger, singleLineString } from '../../logger';

export const DefaultOptions = { stdio: 'inherit' };

export interface SpawnReturn {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export type SpawnPromise = {
  cancel: () => void;
  kill: (signal?: NodeJS.Signals | number) => boolean;
} & Promise<SpawnReturn>;

/**
 * A wrapper for spawn
 *
 * @param cmd       the shell command node vs yarn to use
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
// @ts-ignore
const spawn = async (cmd: string, args: string[], options: object = DefaultOptions): SpawnPromise => {
  const defaultOptions = {
    shell: process.env.SHELL,
  };
  // see https://stackoverflow.com/questions/37459717/error-spawn-enoent-on-windows/37487465
  if (os.platform() === 'win32') {
    // @ts-ignore
    defaultOptions.shell = true;
  }
  const spawnOptions = { ...defaultOptions, ...options };

  const subProcess = execa(cmd, args, spawnOptions);
  const { cancel, kill } = subProcess;

  const promise = subProcess
    .then(({ signal, exitCode, stdout, stderr }) => {
      if (signal === 'SIGKILL') {
        logger.error(
          singleLineString(
            'The script has failed because the process exited too early.',
            'This probably means the system ran out of memory or someone called',
            '`kill -9` on the process.',
          ),
        );
      } else if (signal === 'SIGTERM') {
        logger.warning(
          singleLineString(
            'The script has failed because the process exited too early.',
            'Someone might have called `kill` or `killall`, or the system could',
            'be shutting down.',
          ),
        );
      }

      return {
        exitCode: exitCode || 0,
        stdout: stdout || '',
        stderr: stderr || '',
      };
    })
    .catch((e) => {
      logger.debug(e);

      return {
        exitCode: e.exitCode || 1,
        stderr: e.message || '',
        stdout: '',
      };
    });

  return Object.assign(promise, { cancel, kill });
};

export default spawn;
