import Module from 'module';
import {resolve as pathResolve} from 'path';

interface PackageReplacement {
  name: string;
  replacement: () => any;
}

const {require: origRequire} = Module.prototype;
const packageReplacements: Array<PackageReplacement> = [];

Module.prototype.require = function(name) {
  const match = packageReplacements.find(pr => pr.name === name);
  if (match) {
    return match.replacement();
  }

  return origRequire.apply(this, arguments as any);
};

export const hijack = (name: string, replacement: any) => packageReplacements.push({name, replacement});
export const resolve = (path: string) => pathResolve(process.cwd(), 'node_modules', path);

