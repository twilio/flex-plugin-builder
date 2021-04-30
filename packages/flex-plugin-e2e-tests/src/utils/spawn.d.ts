/// <reference types="node" />
import { SpawnOptionsWithoutStdio } from 'child_process';
interface SpawnResult {
    stdout: string;
    stderr: string;
}
declare const _default: (cmd: string, args: string[], options?: SpawnOptionsWithoutStdio | undefined) => Promise<SpawnResult>;
/**
 * Promisified spawn
 * @param cmd the command to spawn
 * @param args the args to that command
 * @param options spawn options to run
 */
export default _default;
/**
 * Helper for logging the result from a spawn
 * @param result the result to log
 */
export declare const logResult: (result: SpawnResult) => void;
