import { runner } from 'flex-dev-utils';
import { Callback } from 'flex-dev-utils/dist/runner';

/**
 * Runs the callback function if the process is spawned.
 *
 * @param callback
 */
/* istanbul ignore next */
export default async (callback: Callback) => {
  if (isRequiredScript()) {
    await runner(callback, ...process.argv.splice(2));
  }
};

/**
 * Returns true if module is required (i.e. not spawned)
 */
/* istanbul ignore next */
export const isRequiredScript = () => require.main === module.parent;

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
