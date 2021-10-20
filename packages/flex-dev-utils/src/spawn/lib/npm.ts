/* eslint-disable import/no-unused-modules, @typescript-eslint/ban-types, @typescript-eslint/promise-function-async */
import spawn, { DefaultOptions, SpawnPromise } from './spawn';

/**
 * Spawns an npm
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
// @ts-ignore
const npm = async (args: string[], options: object = DefaultOptions): SpawnPromise => spawn('npm', args, options);

export default npm;
