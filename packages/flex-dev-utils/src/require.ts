import appModule from 'app-module-path';
import paths from './paths';

export default appModule;

/**
 * Adds the node_modules to the app module.
 * This is needed because we spawn different scripts when running start/build/test and so we lose the original cwd directory
 */
export const addCWDNodeModule = () => appModule.addPath(paths.app.nodeModulesDir);

/**
 * Returns the absolute path to the pkg if found
 * @param pkg the package to lookup
 */
/* istanbul ignore next */
export const resolveModulePath = (pkg: string) => {
  try {
    return require.resolve(pkg);
  } catch (e) {
    // Now try to specifically set the node_modules path
    const requirePaths: string[] = require.main && require.main.paths || [];
    if (!requirePaths.includes(paths.app.nodeModulesDir)) {
      requirePaths.push(paths.app.nodeModulesDir);
    }

    try {
      return require.resolve(pkg, { paths: requirePaths });
    } catch (e) {
      return false;
    }
  }
};
