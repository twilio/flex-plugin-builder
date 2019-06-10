import Module from 'module';
import { resolve as pathResolve } from 'path';

interface PackageReplacement {
  name: string;
  replacement: () => any;
}

const {require: origRequire} = Module.prototype;
const packageReplacements: PackageReplacement[] = [];

/**
 * Hijacks the {@link require} so we can replace npm packages
 * @param name
 */
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
export const hijack = (name: string, replacement: any) => {
  if (packageReplacements.find((pr) => pr.name === name)) {
    throw new Error(`Package ${name} is already hijacked`);
  }

  packageReplacements.push({name, replacement});
};

/**
 * Resolves the path to the script's node_modules
 * @param path  the path relative to node_modules
 */
export const resolve = (path: string) => pathResolve(process.cwd(), 'node_modules', path);
