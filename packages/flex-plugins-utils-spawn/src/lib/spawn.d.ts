/// <reference types="node" />
export interface SpawnReturn {
    exitCode: number;
    stdout: string;
    stderr: string;
}
interface SPromise<T> extends Promise<T> {
    cancel: () => void;
    kill: (signal?: NodeJS.Signals | number) => boolean;
}
export declare type SpawnPromise = SPromise<SpawnReturn>;
/**
 * A wrapper for spawn
 *
 * @param cmd       the shell command node vs yarn to use
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
export declare const spawn: (cmd: string, args: string[], options?: object) => SpawnPromise;
/**
 * Spawns a node
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
export declare const node: (args: string[], options?: object) => SpawnPromise;
/**
 * Spawns an npm
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
export declare const npm: (args: string[], options?: object) => SpawnPromise;
/**
 * Spawns a yarn
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
export declare const yarn: (args: string[], options?: object) => SpawnPromise;
export default spawn;
