import { CompilerOptions, ModuleResolutionHost, ResolvedModuleWithFailedLookupLocations } from 'typescript';
/**
 * This is taken from https://github.com/TypeStrong/fork-ts-checker-webpack-plugin documentation
 */
interface TS {
    resolveModuleName: (moduleName: string, containingFile: string, options: CompilerOptions, moduleResolutionHost: ResolvedModuleWithFailedLookupLocations) => ResolvedModuleWithFailedLookupLocations;
}
export declare const resolveModuleName: (typescript: TS, moduleName: string, containingFile: string, compilerOptions: CompilerOptions, resolutionHost: ModuleResolutionHost) => ResolvedModuleWithFailedLookupLocations;
export declare const resolveTypeReferenceDirective: (typescript: TS, moduleName: string, containingFile: string, compilerOptions: CompilerOptions, resolutionHost: ModuleResolutionHost) => ResolvedModuleWithFailedLookupLocations;
export {};
