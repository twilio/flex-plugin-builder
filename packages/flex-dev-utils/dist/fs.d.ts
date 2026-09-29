import fs from 'fs';
import FindInFiles from 'find-in-files';
import mkdirp from 'mkdirp';
import rimRaf from 'rimraf';
export interface PackageJson {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    peerDependencies?: Record<string, string>;
}
export interface AppPackageJson extends PackageJson {
    dependencies: {
        '@twilio/flex-plugin': string;
    };
    devDependencies: {
        '@twilio/flex-plugin-scripts': string;
    };
}
export interface FlexConfigurationPlugin {
    name: string;
    dir: string;
}
export interface CLIFlexConfiguration {
    plugins: FlexConfigurationPlugin[];
}
export interface LocallyRunningPluginsConfiguration {
    plugins: string[];
    loadedPlugins: string[];
}
export declare type JsonObject<T> = {
    [K in keyof T]: T[K];
};
export default fs;
/**
 * This is an alias for require. Useful for mocking out in tests
 * @param filePath  the file to require
 * @private
 */
export declare const _require: (filePath: string) => any;
export declare const _setRequirePaths: (requirePath: string) => void;
/**
 * Reads a JSON file
 *
 * @param filePath   the file path to read
 */
export declare const readPackageJson: (filePath: string) => PackageJson;
/**
 * Returns the file size in bytes
 * @param filePaths the path to the file
 */
export declare const getSileSizeInBytes: (...filePaths: string[]) => number;
/**
 * Returns the file size in MB
 * @param filePaths the path to file
 */
export declare const getFileSizeInMB: (...filePaths: string[]) => number;
/**
 * Builds path relative to the given dir
 * @param dir   the dir
 * @param paths the paths
 */
export declare const resolveRelative: (dir: string, ...paths: string[]) => string;
/**
 * Sets the working directory
 * @param p the path to set
 */
export declare const setCwd: (p: string) => void;
/**
 * Returns the working directory
 */
export declare const getCwd: () => string;
/**
 * Sets the core working directory
 * @param p the path to set
 */
export declare const setCoreCwd: (p: string) => void;
/**
 * The core cwd is the working directory of core packages such as flex-plugin-scripts and flex-plugin
 */
export declare const getCoreCwd: () => string;
/**
 * Reads the file
 * @param filePaths  the file paths
 */
export declare const readFileSync: (...filePaths: string[]) => string;
/**
 * Reads a JSON file (Templated)
 *
 * @param filePaths  the file paths to read
 */
export declare const readJsonFile: <T>(...filePaths: string[]) => T;
/**
 * Gets the CLI paths. This is separated out from getPaths because create-flex-plugin also needs to read it,
 * but that script will not have flex-plugin-scripts installed which would cause an exception to be thrown.
 */
export declare const getCliPaths: () => {
    dir: string;
    nodeModulesDir: string;
    flexDir: string;
    pluginsJsonPath: string;
    localPluginsJsonPath: string;
};
export declare const readPluginsJson: () => CLIFlexConfiguration;
export declare const readRunPluginsJson: () => LocallyRunningPluginsConfiguration;
/**
 * Writes string to file
 */
export declare const writeFile: (str: string, ...paths: string[]) => void;
/**
 * Writes an object as a JSON string to the file
 * @param obj the object to write
 * @param paths the path to write to
 */
export declare const writeJSONFile: <T>(obj: JsonObject<T>, ...paths: string[]) => void;
/**
 * Checks the provided array of files exist
 *
 * @param files the files to check that they exist
 */
export declare const checkFilesExist: (...files: string[]) => boolean;
/**
 * Calculates the sha of a file
 * @param paths
 */
export declare const calculateSha256: (...paths: string[]) => Promise<string>;
/**
 * Removes a file
 * @param paths
 */
export declare const removeFile: (...paths: string[]) => void;
/**
 * Copies from from src to dest
 * @param srcPaths
 * @param destPaths
 */
export declare const copyFile: (srcPaths: string[], destPaths: string[]) => void;
/**
 * Checks the provided file exists
 *
 * @param paths the paths to the file
 */
export declare const checkAFileExists: (...paths: string[]) => boolean;
/**
 * Gets package.json path
 */
export declare const getPackageJsonPath: () => string;
/**
 * Reads app package.json from the rootDir.
 */
export declare const readAppPackageJson: () => AppPackageJson;
/**
 * Updates the package.json version field
 *
 * @param version the new version
 */
export declare const updateAppVersion: (version: string) => void;
/**
 * Finds the closest up file relative to dir
 *
 * @param dir   the directory
 * @param file  the file to look for
 */
export declare const findUp: (dir: string, file: string) => string;
/**
 * mkdir -p wrapper
 */
export declare const mkdirpSync: typeof mkdirp.sync;
/**
 * Copies a template by applying the variables
 *
 * @param source    the source
 * @param target    the target
 * @param variables the variables
 */
export declare const copyTemplateDir: (source: string, target: string, variables: object) => Promise<unknown>;
/**
 * rm -rf sync script
 */
export declare const rmRfSync: typeof rimRaf.sync;
/**
 * Builds path relative to cwd
 * @param paths  the paths
 */
export declare const resolveCwd: (...paths: string[]) => string;
/**
 * Finds globs in any cwd directory
 * @param dir     the cwd to check for patterns
 * @param patterns the patterns
 */
export declare const findGlobsIn: (dir: string, ...patterns: string[]) => string[];
/**
 * Finds globs in the src directory
 * @param patterns the patterns
 */
export declare const findGlobs: (...patterns: string[]) => string[];
/**
 * Touch ~/.twilio-cli/flex/plugins.json if it does not exist
 * Check if this plugin is in this config file. If not, add it.
 * @param name  the plugin name
 * @param dir   the plugin directory
 * @param promptForOverwrite  whether to prompt for overwrite
 * @return whether the plugin-directory was overwritten
 */
export declare const checkPluginConfigurationExists: (name: string, dir: string, promptForOverwrite?: boolean) => Promise<boolean>;
/**
 * Touch ~/.twilio-cli/flex/locallyRunningPlugins.json if it does not exist,
 * and if it does exist, clear the file so it is ready for a new run
 */
export declare const checkRunPluginConfigurationExists: (localPlugins: string[]) => Promise<void>;
/**
 * Adds the node_modules to the app module.
 * This is needed because we spawn different scripts when running start/build/test and so we lose
 * the original cwd directory
 */
export declare const addCWDNodeModule: (...args: string[]) => void;
/**
 * Returns the absolute path to the pkg if found
 * @param pkg the package to lookup
 */
export declare const resolveModulePath: (pkg: string, ...paths: string[]) => string | false;
/**
 * Returns the path to flex-plugin-scripts
 */
export declare const _getFlexPluginScripts: () => string;
/**
 * Returns the path to flex-plugin-webpack
 */
export declare const _getFlexPluginWebpackPath: (scriptsNodeModulesDir: string) => string;
/**
 * Returns the paths to all modules and directories used in the plugin-builder
 */
export declare const getPaths: () => {
    cwd: string;
    webpack: {
        dir: string;
        nodeModulesDir: string;
    };
    scripts: {
        dir: string;
        nodeModulesDir: string;
        devAssetsDir: string;
        indexHTMLPath: string;
        tsConfigPath: string;
    };
    cli: {
        dir: string;
        nodeModulesDir: string;
        flexDir: string;
        pluginsJsonPath: string;
        localPluginsJsonPath: string;
    };
    app: {
        dir: string;
        name: string;
        version: string;
        pkgPath: string;
        jestConfigPath: string;
        webpackConfigPath: string;
        devServerConfigPath: string;
        tsConfigPath: string;
        isTSProject: () => boolean;
        setupTestsPaths: string[];
        envPath: string;
        hasEnvFile: () => boolean;
        envExamplePath: string;
        hasEnvExampleFile: () => boolean;
        envDefaultsPath: string;
        hasEnvDefaultsPath: () => boolean;
        buildDir: string;
        bundlePath: string;
        sourceMapPath: string;
        srcDir: string;
        entryPath: string;
        nodeModulesDir: string;
        flexUIDir: string;
        flexUIPkgPath: string;
        publicDir: string;
        appConfig: string;
        dependencies: {
            react: {
                version: string;
            };
            reactDom: {
                version: string;
            };
            flexUI: {
                version: string;
            };
        };
    };
    assetBaseUrlTemplate: string;
    extensions: string[];
};
/**
 * Returns the version of the dependency that is installed in node_modules
 * @param pkgName  the package name
 * @return the version of the package installed
 */
export declare const getDependencyVersion: (pkgName: string) => string;
/**
 * Returns the package.json version field of the package
 * @param name  the package
 */
export declare const getPackageVersion: (name: string) => string;
/**
 * Determines whether the directory is plugin based on the package.json
 * @param packageJson  the package json
 */
export declare const isPluginDir: (packageJson: PackageJson) => boolean;
/**
 * Determines whether the directory is plugin based on the package.json
 * @param packageJson  the package json
 */
export declare const isPluginFolder: () => boolean;
/**
 * Fetches the version corresponding to the dependency inside the given package
 * @param pkg the package.json to check
 * @param name the package to look for
 */
export declare const packageDependencyVersion: (pkg: PackageJson, name: string) => string | null;
/**
 * Fetches the version corresponding to the dependency inside the flex-ui package.json
 * @param name the package to check
 */
export declare const flexUIPackageDependencyVersion: (name: string) => string | null;
/**
 * Zips plugin files and writes it into the location specified
 * @param location Path where the zip file should be written to
 * @param zipPath Path inside the zip into which the files should be compressed
 * @param files Files to be zipped
 */
export declare const zipPluginFiles: (location: string, zipPath?: string, ...files: string[]) => void;
export declare const findInFiles: typeof FindInFiles.find;
