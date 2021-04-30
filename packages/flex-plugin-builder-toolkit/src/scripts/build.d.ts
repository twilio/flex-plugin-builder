import { SpawnPromise } from 'flex-dev-utils';
export declare type BuildOptions = {
    cwd: string;
    name: string;
};
/**
 * Entry point for building a JS bundle
 * @param options
 */
export default function run(options: BuildOptions): SpawnPromise;
