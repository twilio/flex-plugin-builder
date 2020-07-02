import appModule from 'app-module-path';
import { getPaths } from './fs';

export default appModule;

/**
 * Adds the node_modules to the app module.
 * This is needed because we spawn different scripts when running start/build/test and so we lose
 * the original cwd directory
 */
export const addCWDNodeModule = () => appModule.addPath(getPaths().app.nodeModulesDir);

/**
 * Returns the absolute path to the pkg if found
 * @param pkg the package to lookup
 */
/* istanbul ignore next */
export const resolveModulePath = (pkg: string) => {
  try {
    return require.resolve(pkg);
  } catch (e1) {
    // Now try to specifically set the node_modules path
    const requirePaths: string[] = require.main && require.main.paths || [];
    if (!requirePaths.includes(getPaths().app.nodeModulesDir)) {
      requirePaths.push(getPaths().app.nodeModulesDir);
    }

    try {
      return require.resolve(pkg, { paths: requirePaths });
    } catch (e2) {
      return false;
    }
  }
};

/**
 * This is an alias for require. Useful for mocking out in tests
 * @param filePath  the file to require
 * @private
 */
/* istanbul ignore next */
export const _require = (filePath: string) => require(filePath);
