import { logger } from 'flex-dev-utils';

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
        if (process.env.DEBUG === 'true') {
          logger.info(e);
        }
        process.exit(1);
      });
  }
};

export const isSelfScript = () => require.main === module.parent;
