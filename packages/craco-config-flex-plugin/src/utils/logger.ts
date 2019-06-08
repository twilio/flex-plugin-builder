import {format} from 'util';

type Level = 'log' | 'error' | 'warning';

const _log = (level: Level, ...args: any[]) => {
  console[level](format.apply({}, args as any));
};

export const debug = (...args: any[]) => {
  if (process.env.VERBOSE) {
    _log('log', ...args);
  }
};

export const log = (...args: any[]) => {
  _log('log', ...args);
};

export const error = (...args: any[]) => {
  _log('error', ...args);
};

export const warning = (...args: any[]) => {
  _log('warning', ...args);
};

export default {
  debug,
  log,
  warning,
  error,
};
