/* eslint-disable import/no-unused-modules */

import * as _boxen from './lib/boxen';

const boxen = {
  error: _boxen.error,
  warning: _boxen.warning,
  info: _boxen.info,
  print: _boxen.print,
};

export { Logger, coloredStrings } from './lib/logger';
export { default as logger } from './lib/logger';
export { default as strings, multilineString, singleLineString } from './lib/strings';
export { default as table, printArray, printObjectArray } from './lib/table';
export { default as progress } from './lib/progress';
export { default as inquirer, confirm, prompt, choose, Question } from './lib/inquirer';
export { default as columnify } from './lib/columnify';
export { boxen };
