import Module from 'module';
import { resolve as pathResolve, join } from 'path';

interface PackageReplacement {
  name: string;
  replacement: () => any;
}

const { require: origRequire } = Module.prototype;
const packageReplacements: PackageReplacement[] = [];

/**
 * Hijacks the {@link require} so we can replace npm packages
 * @param name
 */
/* istanbul ignore next */
Module.prototype.require = function(name: string) {
  const match = packageReplacements.find((pr) => pr.name === name);
  if (match) {
    return match.replacement();
  }

  return origRequire.apply(this, arguments as any);
};

/**
 * Hijack the package name with the provided replacement
 * @param name          the package name to hijack
 * @param replacement   the package replacement
 */
/* istanbul ignore next */
export const hijack = (name: string, replacement: any) => {
  if (packageReplacements.find((pr) => pr.name === name)) {
    throw new Error(`Package ${name} is already hijacked`);
  }

  packageReplacements.push({name, replacement});
};

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
