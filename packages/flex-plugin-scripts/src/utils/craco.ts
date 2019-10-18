import { spawn } from 'flex-dev-utils';
import { resolve } from './require';

export type CracoCmd = 'start' | 'build' | 'test';

/**
 * Runs Craco script
 *
 * @param cmd   the craco command to run
 * @param args  the args to pass
 */
export default async (cmd: CracoCmd, ...args: string[]): Promise<number> => {
  const spawnCmd = [
    resolve('@craco/craco/bin/craco.js'),
    cmd,
  ];

  const { exitCode } = await spawn('node', spawnCmd.concat(args));

  return exitCode;
};
