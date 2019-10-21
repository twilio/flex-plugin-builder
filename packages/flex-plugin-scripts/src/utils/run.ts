import { runner } from 'flex-dev-utils';
import { Callback } from 'flex-dev-utils/dist/runner';

/**
 * Runs the callback function if the process is spawned.
 *
 * @param callback
 */
export default async (callback: Callback) => {
  if (isRequiredScript()) {
    await runner(callback, ...process.argv.splice(2));
  }
};

/**
 * Returns true if module is required (i.e. not spawned)
 */
export const isRequiredScript = () => require.main === module.parent;

/**
 * Exits if `--process-exit` is provided OR if script is spawned
 *
 * @param exitCode  the exitCode
 * @param args      the process argument
 */
export const exit = (exitCode: number, args: string[]) => {
  // Exit if not an embedded script
  if (args.includes('--process-exit') || !isRequiredScript()) {
    process.exit(exitCode);
  }
};
