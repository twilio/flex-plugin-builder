/**
 * Checks appConfig exists
 *
 * @private
 */
export declare const _checkAppConfig: () => void;
/**
 * Runs pre-start/build checks
 */
declare const preScriptCheck: (...args: string[]) => Promise<void>;
export default preScriptCheck;
