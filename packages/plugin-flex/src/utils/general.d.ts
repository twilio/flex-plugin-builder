declare type Constructable<T> = new (...args: any[]) => T;
export declare const _runInformation = "This command needs to be invoked inside a plugin directory.";
/**
 * Creates the description for the command
 *
 * @param {string} description  the main description
 * @param {boolean} inDirectory  whether this command should be invoked inside a plugin directory or not
 * @returns {string} the updated command
 */
export declare const createDescription: (description: string, inDirectory?: boolean) => string;
/**
 * Checks whether an object is instance of a given class
 * @param instance  the instance to check
 * @param klass     the class to check
 */
export declare const instanceOf: <T>(instance: Object, klass: Constructable<T>) => boolean;
/**
 * Exits the application
 * @param exitCode  the exit code
 */
export declare const exit: (exitCode?: number) => never;
export {};
