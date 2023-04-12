/* eslint-disable @typescript-eslint/no-explicit-any, prefer-named-capture-group */
import { format } from 'util';

import chalk from 'chalk';
import wrapAnsi from 'wrap-ansi';
import { pipe } from '@k88/pipe-compose';
import env from '@twilio/flex-plugins-utils-env';
import stringWidth from 'string-width';

import columnify from './columnify';

type Level = 'info' | 'error' | 'warn';
type Color = 'red' | 'yellow' | 'green' | 'cyan' | 'magenta';

interface ColumnsOptions {
  indent?: boolean;
}

// LogLevels
export type LogLevels = 'debug' | 'info' | 'warning' | 'error' | 'trace' | 'success';

interface LogArg {
  color?: Color;
  level: Level;
  args: string[];
}

interface LoggerOptions {
  isQuiet?: boolean;
  isDebug?: boolean;
  isTrace?: boolean;
  markdown?: boolean;
}

interface Formatter {
  [key: string]: {
    openChars: string;
    closeChars: string;
    render: (msg: string) => string;
  };
}

// The default option for wrap-ansi
const DefaultWrapOptions = { hard: true };

export const coloredStrings = {
  dim: chalk.dim,
  bold: chalk.bold,
  italic: chalk.italic,
  code: chalk.magenta,
  link: chalk.cyan,
  info: chalk.blue,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  headline: chalk.bold.green,
  name: chalk.bold.magenta,
  digit: chalk.magenta,
};

/**
 * The Logger class
 */
export class Logger {
  private static formatter: Formatter = {
    dim: {
      openChars: '\\.{2}',
      closeChars: '\\.{2}',
      render: coloredStrings.dim,
    },
    bold: {
      openChars: '\\*{2}',
      closeChars: '\\*{2}',
      render: coloredStrings.bold,
    },
    italic: {
      openChars: '\\_',
      closeChars: '\\_',
      render: coloredStrings.italic,
    },
    code: {
      openChars: '\\{{2}',
      closeChars: '\\}{2}',
      render: coloredStrings.code,
    },
    link: {
      openChars: '\\[{2}',
      closeChars: '\\]{2}',
      render: coloredStrings.link,
    },
    info: {
      openChars: '@{2}',
      closeChars: '@{2}',
      render: coloredStrings.info,
    },
    success: {
      openChars: '\\+{2}',
      closeChars: '\\+{2}',
      render: coloredStrings.success,
    },
    warning: {
      openChars: '\\!{2}',
      closeChars: '\\!{2}',
      render: coloredStrings.warning,
    },
    error: {
      openChars: '\\-{2}',
      closeChars: '\\-{2}',
      render: coloredStrings.error,
    },
  };

  private readonly options: LoggerOptions;

  constructor(options?: LoggerOptions) {
    this.options = options || {};
  }

  /**
   * debug level log
   * @param args
   */
  public debug = (...args: any[]): void => {
    if (this.isDebug()) {
      this._log({ level: 'info', args });
    }
  };

  /**
   * trace level trace
   * @param args
   */
  public trace = (...args: any[]): void => {
    if (this.isTrace()) {
      this._log({ level: 'info', args });
    }
  };

  /**
   * info level log
   * @param args
   */
  public info = (...args: any[]): void => {
    this._log({ level: 'info', args });
  };

  /**
   * success level log
   * @param args
   */
  public success = (...args: any[]): void => {
    this._log({ level: 'info', color: 'green', args });
  };

  /**
   * error level log
   * @param args
   */
  public error = (...args: any[]): void => {
    this._log({ level: 'error', color: 'red', args });
  };

  /**
   * warning level log
   * @param args
   */
  public warning = (...args: any[]): void => {
    this._log({ level: 'warn', color: 'yellow', args });
  };

  /**
   * Notice log is info level with a magenta color
   * @param args
   */
  public notice = (...args: any[]): void => {
    this._log({ level: 'info', color: 'magenta', args });
  };

  /**
   * Simple wrapper for column printing
   * @param lines
   * @param options
   */
  public columns = (lines: string[][], options?: ColumnsOptions): void => {
    const minWidths = Array(lines[0].length).fill(0);
    lines.forEach((line) => {
      line.forEach((entry, index) => {
        minWidths[index] = Math.max(minWidths[index], stringWidth(entry));
      });
    });

    // Convert array to object
    const data = lines.map((line) => {
      return line.reduce((accum, entry, index) => {
        accum[`entry${index}`] = entry;

        return accum;
      }, {});
    });

    // create the configuration
    const config = minWidths.reduce((accum, minWidth, index) => {
      if (index < minWidths.length - 1) {
        minWidth += 5;
      }
      accum[`entry${index}`] = { minWidth };

      return accum;
    }, {});

    let cols = columnify(data, { showHeaders: false, config });
    if (options?.indent) {
      cols = cols
        .split('\n')
        .map((entry) => `\t${entry}`)
        .join('\n');
    }

    this._log({ level: 'info', args: [cols] });
  };

  /**
   * Appends new line
   * @param lines the number of lines to append
   */
  public newline = (lines: number = 1): void => {
    for (let i = 0; i < lines; i++) {
      this.info();
    }
  };

  /**
   * A wrapper for showing bash command information such as `npm install foo`
   * @param command the bash command
   * @param args  the remaining arguments
   */
  public installInfo = (command: string, ...args: string[]): void => {
    this.info('\t', chalk.cyan(command), ...args);
  };

  /**
   * Clears the terminal either if forced is provided, or if persist_terminal env is not set
   */
  /* c8 ignore next */
  public clearTerminal = (forced = false): void => {
    if (forced || !env.isTerminalPersisted()) {
      process.stdout.write(env.isWin32() ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
    }
  };

  /**
   * Provides basic markdown support. Currently supported bold **bold** and italic _italic_
   * @param msg
   */
  public markdown = (msg?: string): string | undefined => {
    if (!msg || msg === '') {
      return msg;
    }

    for (const key in Logger.formatter) {
      if (Logger.formatter.hasOwnProperty(key)) {
        const formatter = Logger.formatter[key];
        const regex = new RegExp(`${formatter.openChars}(.*?)${formatter.closeChars}`);
        const match = msg.match(regex);

        if (match) {
          const replace = match[0]
            .replace(new RegExp(formatter.openChars, 'g'), '')
            .replace(new RegExp(formatter.closeChars, 'g'), '');
          return this.markdown(msg.replace(regex, formatter.render(replace)));
        }
      }
    }

    return msg.replace(/\\/g, '');
  };

  /**
   * The internal logger method
   * @param args
   * @private
   */
  private _log = (args: LogArg): void => {
    if (!this.isQuiet() || args.level === 'error' || this.isDebug()) {
      // eslint-disable-next-line no-console
      const log = console[args.level];
      const color = args.color ? chalk[args.color] : (msg: string) => msg;
      const msg = format.apply({}, args.args as any);

      pipe(msg, color, this.markdown, log);
    }
  };

  /**
   * Checks whether the logger is set for debug mode
   */
  private isDebug = (): boolean => {
    if ('isDebug' in this.options) {
      return this.options.isDebug || false;
    }

    return env.isDebug();
  };

  /**
   * Checks whether the logger is set for trace mode
   */
  private isTrace = (): boolean => {
    if ('isTrace' in this.options) {
      return this.options.isTrace || false;
    }

    return env.isTrace();
  };

  private isQuiet = (): boolean => {
    if ('isQuiet' in this.options) {
      return this.options.isQuiet || false;
    }

    return env.isQuiet();
  };
}

/**
 * Word wrapping using ANSI escape codes
 *
 * @param input     the string to wrap
 * @param columns   number of columns
 * @param options   options
 */
const wrap = (input: string, columns: number, options = DefaultWrapOptions): string => {
  return wrapAnsi(input, columns, options);
};

/**
 * The default logger will use environment variables to determine behavior.
 * You can create an instance to overwrite default behavior.
 */
export const _logger = new Logger();
const { debug, info, warning, error, trace, success, newline, notice, installInfo, clearTerminal, markdown, columns } =
  _logger;

export default {
  debug,
  info,
  warning,
  error,
  trace,
  success,
  newline,
  notice,
  installInfo,
  clearTerminal,
  markdown,
  wrap,
  columns,
  colors: chalk,
  coloredStrings,
};
