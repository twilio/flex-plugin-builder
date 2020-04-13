import appModule from 'app-module-path';
import { join } from 'path';

export default appModule;

/**
 * Adds the node_modules to the app module.
 * This is needed because we spawn different scripts when running start/build/test and so we lose the original cwd directory
 */
export const addCWDNodeModule = () => appModule.addPath(join(process.cwd(), 'node_modules'));
