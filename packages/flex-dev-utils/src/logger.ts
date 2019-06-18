import { format } from 'util';
import chalk from 'chalk';

type Level = 'info' | 'error' | 'warn';
type Color = 'red' | 'yellow' | 'green' | 'blue';

interface LogArg {
  color?: Color;
  level: Level;
  args: string[];
}

/**
 * debug level log
 * @param args
 */
export const debug = (...args: any[]) => {
  if (process.env.VERBOSE) {
    _log({level: 'info', args});
  }
};

/**
 * trace level trace
 * @param args
 */
export const trace = (...args: any[]) => {
  if (process.env.DEBUG_TRACE) {
    _log({level: 'info', args});
  }
};

/**
 * info level log
 * @param args
 */
export const info = (...args: any[]) => {
  _log({level: 'info', args});
};

/**
 * success level log
 * @param args
 */
export const success = (...args: any[]) => {
  _log({level: 'info', color: 'green', args});
};

/**
 * error level log
 * @param args
 */
export const error = (...args: any[]) => {
  _log({level: 'error', color: 'red', args});
};

/**
 * warning level log
 * @param args
 */
export const warning = (...args: any[]) => {
  _log({level: 'warn', color: 'yellow', args});
};

export const newline = (lines: number = 1) => {
  for (let i = 0; i < lines; i++) {
    info();
  }
};

/**
 *  The internal logger method
 * @param args
 * @private
 */
const _log = (args: LogArg) => {
  const color = args.color ? chalk[args.color] : null;
  const msg = format.apply({}, args.args as any);
  console[args.level](color && color(msg) || msg);
};

export default {
  debug,
  info,
  warning,
  error,
  trace,
  success,
  newline,
  colors: chalk,
};
