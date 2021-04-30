export declare type Constructable<T> = new (...args: any[]) => T;
/**
 * Base class for all errors generated by the script
 */
export default class TwilioError extends Error {
    constructor(msg?: string);
    /**
     * Returns whether this is the instance of the passed class
     * @param klass the error class to test for
     */
    instanceOf: <T extends Error>(klass: Constructable<T>) => boolean;
}
