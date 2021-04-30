import { SpawnPromise } from 'flex-dev-utils';
export declare type DeployOptions = {
    cwd: string;
    name: string;
};
/**
 * Entry point for deploying a JS bundle
 * @param options
 */
export default function run(options: DeployOptions): SpawnPromise;
