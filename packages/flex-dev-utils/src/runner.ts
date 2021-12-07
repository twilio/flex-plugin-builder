import { logger } from './logger';
import { FlexPluginError } from './errors';

// eslint-disable-next-line import/no-unused-modules
export type Callback = (...argv: string[]) => void;

/**
 * A runner that calls a callable function, and handles the exception
 * @param callback
 * @param args
 */
export default async (callback: Callback, ...args: string[]): Promise<unknown> => {
  try {
    return await callback(...args);
  } catch (e) {
    if (e instanceof FlexPluginError) {
      e.print();
      if (process.env.DEBUG) {
        e.details();
      }
    } else {
      logger.error(e);
    }

    // eslint-disable-next-line no-process-exit
    return process.exit(1);
  }
};
