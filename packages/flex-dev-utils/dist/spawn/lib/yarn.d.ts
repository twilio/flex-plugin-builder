import { SpawnPromise } from './spawn';
/**
 * Spawns a yarn
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
declare const yarn: (args: string[], options?: object) => SpawnPromise;
export default yarn;
