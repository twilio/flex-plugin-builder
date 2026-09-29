import { SpawnPromise } from './spawn';
/**
 * Spawns an npm
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
declare const npm: (args: string[], options?: object) => SpawnPromise;
export default npm;
