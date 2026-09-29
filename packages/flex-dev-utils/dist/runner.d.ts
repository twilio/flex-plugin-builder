export declare type Callback = (...argv: string[]) => void;
declare const _default: (callback: Callback, ...args: string[]) => Promise<unknown>;
/**
 * A runner that calls a callable function, and handles the exception
 * @param callback
 * @param args
 */
export default _default;
