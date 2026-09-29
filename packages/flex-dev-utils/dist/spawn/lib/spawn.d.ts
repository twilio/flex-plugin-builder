/// <reference types="node" />
export declare const DefaultOptions: {
    stdio: string;
};
export interface SpawnReturn {
    exitCode: number;
    stdout: string;
    stderr: string;
}
export declare type SpawnPromise = {
    cancel: () => void;
    kill: (signal?: NodeJS.Signals | number) => boolean;
} & Promise<SpawnReturn>;
/**
 * A wrapper for spawn
 *
 * @param cmd       the shell command node vs yarn to use
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
declare const spawn: (cmd: string, args: string[], options?: object) => SpawnPromise;
export default spawn;
