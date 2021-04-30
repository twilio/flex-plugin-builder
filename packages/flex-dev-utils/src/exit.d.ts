/**
 * Exits unless --no-process-exit flag is provided
 *
 * @param exitCode  the exitCode
 * @param args      the process argument
 */
declare const exit: (exitCode: number, args?: string[]) => void;
export default exit;
