import { logger } from 'flex-dev-utils';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';

type Callback = (...argv: string[]) => void;

/**
 * Runs the callback function if the process is spawned.
 *
 * @param callback
 */
export default (callback: Callback) => {
  if (isSelfScript()) {
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

export const isSelfScript = () => require.main === module.parent;
