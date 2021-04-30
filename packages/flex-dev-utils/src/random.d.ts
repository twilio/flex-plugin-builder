/**
 * Generates a random string
 *
 * @param n the length of the string
 * @private
 */
export declare const _randomGenerator: (n: number) => string;
/**
 * Generates a random string; if a list is provided, ensures the string is not in the list
 *
 * @param length    the length
 * @param list      the list to ensure the new string is unique
 */
export declare const randomString: (length: number, list?: string[]) => string;
export default randomString;
