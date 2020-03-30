/**
 * Generates a random string
 *
 * @param n the length of the string
 * @private
 */
export const _randomGenerator = (n: number) => Math.random().toString(26).slice(2).substring(0, n);

/**
 * Generates a random string; if a list is provided, ensures the string is not in the list
 *
 * @param length    the length
 * @param list      the list to ensure the new string is unique
 */
export const randomString = (length: number, list: string[] = []) => {
  let str = _randomGenerator(length);

  while (list.includes(str)) {
    str = _randomGenerator(length);
  }

  return str;
};

export default randomString;
