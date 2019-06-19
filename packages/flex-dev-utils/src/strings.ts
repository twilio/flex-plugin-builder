/**
 * Converts an array of arguments into a multiline string
 *
 * @param args  the lines to print
 */
export const multilineString = (...args: string[]) => args.join('\r\n');

export default {
  multilineString,
};
