import { SpawnPromise } from 'flex-dev-utils';
export declare type StartOptions = {
    cwd: string;
    name: string;
};
/**
 * Entry point for starting a dev-server
 * @param options
 */
export default function run(options: StartOptions): SpawnPromise;
