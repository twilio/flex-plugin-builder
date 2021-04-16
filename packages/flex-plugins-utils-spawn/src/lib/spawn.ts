/* eslint-disable import/no-unused-modules, @typescript-eslint/ban-types, @typescript-eslint/promise-function-async */

import os from 'os';

import execa from 'execa';
import { logger, singleLineString } from 'flex-plugins-utils-logger';

const DefaultOptions = { stdio: 'inherit' };

export interface SpawnReturn {
  exitCode: number;
  stdout: string;
  stderr: string;
}

interface SPromise<T> extends Promise<T> {
  cancel: () => void;

  kill: (signal?: NodeJS.Signals | number) => boolean;
}

export type SpawnPromise = SPromise<SpawnReturn>;

/**
 * A wrapper for spawn
 *
 * @param cmd       the shell command node vs yarn to use
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
export const spawn = (cmd: string, args: string[], options: object = DefaultOptions): SpawnPromise => {
  const defaultOptions = {
    shell: process.env.SHELL,
  };
  // see https://stackoverflow.com/questions/37459717/error-spawn-enoent-on-windows/37487465
  if (os.platform() === 'win32') {
    defaultOptions.shell = 'true';
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

/**
 * Spawns a node
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
export const node = (args: string[], options: object = DefaultOptions): SpawnPromise => spawn('node', args, options);

/**
 * Spawns an npm
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
export const npm = (args: string[], options: object = DefaultOptions): SpawnPromise => spawn('npm', args, options);

/**
 * Spawns a yarn
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
export const yarn = (args: string[], options: object = DefaultOptions): SpawnPromise => spawn('yarn', args, options);

export default spawn;
