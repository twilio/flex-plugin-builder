import appModule from 'app-module-path';
import { join } from 'path';

export default appModule;

export const addCWDNodeModule = () => appModule.addPath(join(process.cwd(), 'node_modules'));

export const resolveModulePath = (pkg: string) => {
  try {
    return require.resolve(pkg);
  } catch (e) {
    return false;
  }
};
