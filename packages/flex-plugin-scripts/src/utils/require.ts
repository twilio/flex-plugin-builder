import { join } from 'path';

export const nodeModulesPath = join(process.cwd(), 'node_modules');

/**
 * Resolves the path to the given module. Appends the process.cwd node_modules as well
 *
 * @param module the module to resolve
 */
/* istanbul ignore next */
export const resolve = (module: string): string => {
  const paths: string[] = require.main && require.main.paths || [];
  if (!paths.includes(nodeModulesPath)) {
    paths.push(nodeModulesPath);
  }

  return require.resolve(module, { paths });
};

/**
 * Returns the package.json version field of the package
 * @param name  the package
 */
/* istanbul ignore next */
export const getPackageVersion = (name: string) => {
  return require(join(nodeModulesPath, name, 'package.json')).version;
}
