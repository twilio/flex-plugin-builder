/**
 * Converts an array of arguments into a multiline string
 *
 * @param args  the lines to print
 */
export const multilineString = (...args: string[]): string => args.join('\r\n');

/**
 * Converts an array of string into a single lin
 * @param args  the lines to print
 */
export const singleLineString = (...args: string[]): string =>
  args.map((arg, index) => (index === 0 ? arg.trim() : ` ${arg.trim()}`)).join('');

export default {
  multilineString,
  singleLineString,
};
