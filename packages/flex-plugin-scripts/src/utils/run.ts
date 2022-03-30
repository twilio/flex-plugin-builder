import { runner } from '@twilio/flex-dev-utils';
import { Callback } from '@twilio/flex-dev-utils/dist/runner';

/**
 * Runs the callback function if the process is spawned.
 *
 * @param callback
 */
export default async (callback: Callback): Promise<void> => {
  if (process.argv.includes('--run-script')) {
    await runner(callback, ...process.argv.splice(2));
  }
};
