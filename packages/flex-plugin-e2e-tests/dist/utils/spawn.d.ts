/// <reference types="node" />
import { ChildProcessWithoutNullStreams, SpawnOptionsWithoutStdio } from 'child_process';
interface SpawnResult {
    stdout: string;
    stderr: string;
    child?: ChildProcessWithoutNullStreams;
}
/**
 * Promisified spawn
 * @param cmd the command to spawn
 * @param args the args to that command
 * @param options spawn options to run
 */
export declare const promisifiedSpawn: (cmd: string, args: string[], options?: SpawnOptionsWithoutStdio | undefined) => Promise<SpawnResult>;
/**
 * Helper for logging the result from a spawn
 * @param result the result to log
 */
export declare const logResult: (result: SpawnResult) => void;
/**
 * Kills child process
 * @param child child process to kill
 * @param os operating system
 */
export declare const killChildProcess: (child: ChildProcessWithoutNullStreams | undefined, os: string, retry?: number) => Promise<void>;
export declare const retryOnError: (method: (first: boolean) => Promise<unknown>, onError: (e: any) => Promise<unknown>, onFinally: () => Promise<unknown>, maxRetries: number) => Promise<void>;
export {};
