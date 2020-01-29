import { join } from 'path';
/**
 * Resolves the path to the given module. Appends the process.cwd node_modules as well
 *
 * @param module the module to resolve
 */
/* istanbul ignore next */
export const resolve = (module: string): string => {
  const paths: string[] = require.main && require.main.paths || [];
  const nodeModulesPath = join(process.cwd(), 'node_modules');
  if (!paths.includes(nodeModulesPath)) {
    paths.push(nodeModulesPath);
  }

  return require.resolve(module, { paths });
};
