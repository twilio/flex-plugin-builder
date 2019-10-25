import logger from './logger';
import { FlexPluginError } from './errors';

export type Callback = (...argv: string[]) => void;

/**
 * A runner that calls a callable function, and handles the exception
 * @param callback
 * @param args
 */
export default async (callback: Callback, ...args: string[]) => {
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

    return process.exit(1);
  }
};
