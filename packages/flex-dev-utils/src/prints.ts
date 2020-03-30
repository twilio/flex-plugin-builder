import logger from './logger';
import { multilineString } from './strings';

/**
 * Prints the lines in a numbered list:
 *  1. line 1
 *  2. line 2
 *  3. line 3
 *
 * @param lines the lines to print
 */
export const printList = (...lines: string[]) => {
  const digitColor = logger.coloredStrings.digit;

  lines = lines.map((line, index) => `\t ${digitColor((index + 1).toString())}. ${line}`);
  logger.newline();
  logger.info(multilineString(...lines));
  logger.newline();
};

export default {};
