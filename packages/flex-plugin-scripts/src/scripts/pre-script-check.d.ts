interface Package {
    version: string;
    dependencies: Record<string, string>;
}
export declare const FLAG_MULTI_PLUGINS = "--multi-plugins-pilot";
export declare const flags: string[];
/**
 * Returns true if there are any .d.ts/.ts/.tsx files
 */
export declare const _hasTypescriptFiles: () => boolean;
/**
 * Validates the TypeScript project
 * @private
 */
export declare const _validateTypescriptProject: () => void;
/**
 * Checks the version of external libraries and exists if customer is using another version
 *
 * @param flexUIPkg   the flex-ui package.json
 * @param allowSkip   whether to allow skip
 * @param allowReact  whether to allow unbundled react
 * @param name        the package to check
 * @private
 */
export declare const _verifyPackageVersion: (flexUIPkg: Package, allowSkip: boolean, allowReact: boolean, name: string) => void;
/**
 * Checks the version of external libraries and exists if customer is using another version
 *
 * allowSkip  whether to allow skip
 * allowReact whether to allow reacts
 * @private
 */
export declare const _checkExternalDepsVersions: (allowSkip: boolean, allowReact: boolean) => void;
/**
 * Returns the content of src/index
 * @private
 */
export declare const _readIndexPage: () => string;
/**
 * Checks how many plugins this single JS bundle is exporting
 * You can only have one plugin per JS bundle
 * @private
 */
export declare const _checkPluginCount: () => void;
/**
 * Attempts to set the cwd of the plugin
 * @param args  the CLI args
 * @private
 */
export declare const _setPluginDir: (...args: string[]) => void;
/**
 * Runs pre-start/build checks
 */
declare const preScriptCheck: (...args: string[]) => Promise<void>;
export default preScriptCheck;
