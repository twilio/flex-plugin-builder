import { format } from 'util';
import chalk from 'chalk';
import wrapAnsi from 'wrap-ansi';
import env from './env';

type Level = 'info' | 'error' | 'warn';
type Color = 'red' | 'yellow' | 'green' | 'blue' | 'cyan';

// LogLevels
export type LogLevels = 'debug'
  | 'info'
  | 'warning'
  | 'error'
  | 'trace'
  | 'success';

interface LogArg {
  color?: Color;
  level: Level;
  args: string[];
}

// The default option for wrap-ansi
const DefaultWrapOptions = { hard: true };

/**
 * debug level log
 * @param args
 */
export const debug = (...args: any[]) => {
  if (env.isDebug()) {
    _log({level: 'info', args});
  }
};

/**
 * trace level trace
 * @param args
 */
export const trace = (...args: any[]) => {
  if (env.isTrace()) {
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

/**
 * Notice log is info level with a cyan color
 * @param args
 */
export const notice = (...args: any[]) => {
  _log({level: 'info', color: 'cyan', args});
};

/**
 * Appends new line
 * @param lines the number of lines to append
 */
export const newline = (lines: number = 1) => {
  for (let i = 0; i < lines; i++) {
    info();
  }
};

/**
 * A wrapper for showing bash command information such as `npm install foo`
 * @param command the bash command
 * @param args  the remaining arguments
 */
export const installInfo = (command: string, ...args: string[]) => {
  info('\t', chalk.cyan(command), ...args);
};

/**
 * Word wrapping using ANSI escape codes
 *
 * @param input     the string to wrap
 * @param columns   number of columns
 * @param options   options
 */
export const wrap = (input: string, columns: number, options = DefaultWrapOptions) => {
  return wrapAnsi(input, columns, options);
};

/**
 * Clears the terminal either if forced is provided, or if persist_terminal env is not set
 */
/* istanbul ignore next */
export const clearTerminal = (forced = false) => {
  if (forced || !env.isTerminalPersisted()) {
    process.stdout.write(env.isWin32() ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
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
  wrap,
  clearTerminal,
  notice,
  installInfo,
  colors: chalk,
  coloredStrings: {
    link: (str: string) => chalk.blue(str),
    headline: (str: string) => chalk.bold.green(str),
    name: (str: string) => chalk.bold.magenta(str),
    digit: (str: string) => chalk.cyan(str),
  },
};
