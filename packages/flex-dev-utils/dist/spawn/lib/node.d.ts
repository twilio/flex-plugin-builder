import { SpawnPromise } from './spawn';
/**
 * Spawns a node
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
declare const node: (args: string[], options?: object) => SpawnPromise;
export default node;
