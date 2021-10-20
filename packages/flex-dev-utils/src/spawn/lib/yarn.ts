/* eslint-disable import/no-unused-modules, @typescript-eslint/ban-types, @typescript-eslint/promise-function-async */
import spawn, { SpawnPromise, DefaultOptions } from './spawn';

/**
 * Spawns a yarn
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
// @ts-ignore
const yarn = async (args: string[], options: object = DefaultOptions): SpawnPromise => spawn('yarn', args, options);

export default yarn;
