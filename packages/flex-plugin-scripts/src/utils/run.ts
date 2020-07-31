import { runner } from 'flex-dev-utils';
import { Callback } from 'flex-dev-utils/dist/runner';

/**
 * Runs the callback function if the process is spawned.
 *
 * @param callback
 */
export default async (callback: Callback) => {
  if (process.argv.includes('--run-script')) {
    await runner(callback, ...process.argv.splice(2));
  }
};

/**
 * Exits unless --no-process-exit flag is provided
 *
 * @param exitCode  the exitCode
 * @param args      the process argument
 */
export const exit = (exitCode: number, args: string[] = []) => {
  // Exit if not an embedded script
  if (!args.includes('--no-process-exit')) {
    process.exit(exitCode);
  }
};
