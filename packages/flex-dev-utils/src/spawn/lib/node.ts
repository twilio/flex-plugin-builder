/* eslint-disable import/no-unused-modules, @typescript-eslint/ban-types, @typescript-eslint/promise-function-async */
import spawn, { DefaultOptions, SpawnPromise } from './spawn';

/**
 * Spawns a node
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
// @ts-ignore
const node = async (args: string[], options: object = DefaultOptions): SpawnPromise => spawn('node', args, options);

export default node;
