import { logger } from 'flex-dev-utils';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';

type Callback = (...argv: string[]) => void;

/**
 * Runs the callback function if the process is spawned.
 *
 * @param callback
 */
export default (callback: Callback) => {
  if (isRequiredScript()) {
    (async () => await callback(...process.argv.splice(2)))()
      .catch((e) => {
        if (e instanceof FlexPluginError) {
          e.print();
          if (process.env.DEBUG) {
            e.details();
          }
        } else {
          logger.error(e);
        }

        return process.exit(1);
      });
  }
};

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
