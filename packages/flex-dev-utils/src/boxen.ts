import boxen from 'boxen';
import logSymbols from 'log-symbols';
import logger from './logger';

export default boxen;

/**
 * Prints the message inside a box
 *
 * @param level   the log level to display the message as
 * @param msg     the message
 */
export const print = (level: keyof typeof logger, msg: string) => {
  const boxed = boxen(msg, {
    padding: 1,
    margin: 1,
  });

  logger[level](boxed);
};

/**
 * Displays the message as a warning box
 *
 * @param msg         the message to display
 * @param showSymbol  whether wrap the message in a warning symbol
 */
export const warning = (msg: string, showSymbol: boolean = true) => {
  const sym = logSymbols.warning;

  if (showSymbol) {
    msg = `${sym} ${msg} ${sym}`;
  }

  print('warning', msg);
};

/**
 * Displays the message as an info box
 *
 * @param msg         the message to display
 * @param showSymbol  whether wrap the message in an info symbol
 */
export const info = (msg: string, showSymbol: boolean = true) => {
  const sym = logSymbols.info;

  if (showSymbol) {
    msg = `${sym} ${msg} ${sym}`;
  }

  print('info', msg);
};

/**
 * Displays the message as am error box
 *
 * @param msg         the message to display
 * @param showSymbol  whether wrap the message in an error symbol
 */
export const error = (msg: string, showSymbol: boolean = true) => {
  const sym = logSymbols.error;

  if (showSymbol) {
    msg = `${sym} ${msg} ${sym}`;
  }

  print('error', msg);
};

/**
 * Displays the message as a success box
 *
 * @param msg         the message to display
 * @param showSymbol  whether wrap the message in a success symbol
 */
export const success = (msg: string, showSymbol: boolean = true) => {
  const sym = logSymbols.success;

  if (showSymbol) {
    msg = `${sym} ${msg} ${sym}`;
  }

  print('success', msg);
};
