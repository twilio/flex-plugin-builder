declare type NullUndefined = null | undefined | unknown;
declare type Primitive = number | string | object;
/**
 * Converts a string from camelCase to Sentence Case
 * @param key
 */
export declare const toSentenceCase: (key: string) => string;
/**
 * Returns true if value is null or undefined
 * @param value the value to check
 */
export declare const isNullOrUndefined: (value?: NullUndefined | Primitive) => boolean;
export {};
