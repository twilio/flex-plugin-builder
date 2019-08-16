import { logger } from 'flex-dev-utils';

type Callback = (...argv: string[]) => void;

/**
 * Runs the callback function if the process is spawned.
 *
 * @param callback
 */
export default (callback: Callback) => {
  if (require.main === module.parent) {
    (async () => await callback(...process.argv.splice(2)))()
      .catch((e) => {
        if (process.env.DEBUG === 'true') {
          logger.info(e);
        } else {
          process.exit(1);
        }
      });
  }
};
