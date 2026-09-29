export declare const DEFAULT_JEST_ENV = "jsdom";
/**
 * Validates that this is Jest test framework and that all dependencies are installed.
 * @private
 */
export declare const _validateJest: () => void;
/**
 * Parses the args passed to the CLI
 * @param args  the args
 * @private
 */
export declare const _parseArgs: (...args: string[]) => {
    jestEnv: string;
    cleanArgs: string[];
};
/**
 * Runs Jest tests
 */
declare const test: (...args: string[]) => Promise<void>;
export default test;
