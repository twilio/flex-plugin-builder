/* istanbul ignore file */
import { CompilerOptions, ModuleResolutionHost, ResolvedModuleWithFailedLookupLocations } from 'typescript';
import { resolveModuleName as resolver } from 'ts-pnp';

/**
 * This is taken from https://github.com/TypeStrong/fork-ts-checker-webpack-plugin documentation
 */

// Taken from 'ts-pnp'; this is not exported as a type itself
interface TS {
  resolveModuleName: (
    moduleName: string,
    containingFile: string,
    options: CompilerOptions,
    moduleResolutionHost: ResolvedModuleWithFailedLookupLocations,
  ) => ResolvedModuleWithFailedLookupLocations;
}

export const resolveModuleName = (
  typescript: TS,
  moduleName: string,
  containingFile: string,
  compilerOptions: CompilerOptions,
  resolutionHost: ModuleResolutionHost,
) => {
  return resolver(moduleName, containingFile, compilerOptions, resolutionHost, typescript.resolveModuleName);
};

export const resolveTypeReferenceDirective = (
  typescript: TS,
  moduleName: string,
  containingFile: string,
  compilerOptions: CompilerOptions,
  resolutionHost: ModuleResolutionHost,
) => {
  return resolver(moduleName, containingFile, compilerOptions, resolutionHost, typescript.resolveModuleName);
};
