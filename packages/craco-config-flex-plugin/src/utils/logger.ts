import { format } from 'util';

type Level = 'info' | 'error' | 'warning';

/**
 * debug level log
 * @param args
 */
export const debug = (...args: any[]) => {
  if (process.env.VERBOSE) {
    _log('info', ...args);
  }
};

/**
 * info level log
 * @param args
 */
export const info = (...args: any[]) => {
  _log('info', ...args);
};

/**
 * error level log
 * @param args
 */
export const error = (...args: any[]) => {
  _log('error', ...args);
};

/**
 * warning level log
 * @param args
 */
export const warning = (...args: any[]) => {
  _log('warning', ...args);
};

/**
 * The internal logger method
 *
 * @param level the log {@link Level}
 * @param args  the arguments of the logger
 * @private
 */
const _log = (level: Level, ...args: any[]) => {
  console[level](format.apply({}, args as any));
};

export default {
  debug,
  info,
  warning,
  error,
};
