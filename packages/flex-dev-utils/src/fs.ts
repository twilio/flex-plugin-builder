import fs from 'fs';
import * as path from 'path';
import os, { homedir } from 'os';
import { promisify } from 'util';

import globby from 'globby';
import mkdirp from 'mkdirp';
import rimRaf from 'rimraf';
import appModule from 'app-module-path';

import { confirm } from './inquirer';

export interface PackageJson {
  name: string;
  version: string;
  dependencies: Record<string, string>;
}

export interface AppPackageJson extends PackageJson {
  dependencies: {
    'flex-plugin': string;
    'flex-plugin-scripts': string;
  };
}

export interface FlexConfigurationPlugin {
  name: string;
  dir: string;
  port: number;
}

export interface CLIFlexConfiguration {
  plugins: FlexConfigurationPlugin[];
}

export default fs;

const packageJsonStr = 'package.json';

/**
 * This is an alias for require. Useful for mocking out in tests
 * @param filePath  the file to require
 * @private
 */
/* istanbul ignore next */
// eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/explicit-module-boundary-types
export const _require = (filePath: string) => require(filePath);

// Set working directory
export const _setRequirePaths = (requirePath: string): void => {
  appModule.addPath(requirePath);

  // Now try to specifically set the node_modules path
  const requirePaths: string[] = (require.main && require.main.paths) || [];
  if (!requirePaths.includes(requirePath)) {
    requirePaths.push(requirePath);
  }
};

/**
 * Reads a JSON file
 *
 * @param filePath   the file path to read
 */
export const readPackageJson = (filePath: string): PackageJson => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

/**
 * Builds path relative to the given dir
 * @param dir   the dir
 * @param paths the paths
 */
export const resolveRelative = (dir: string, ...paths: string[]): string => {
  if (paths.length === 0) {
    return dir;
  }

  const lastElement = paths[paths.length - 1];
  // Check if last element is an extension
  if (lastElement.charAt(0) !== '.') {
    return path.join(dir, ...paths);
  }

  // Only one entry as extension
  if (paths.length === 1) {
    return path.join(`${dir}${lastElement}`);
  }
  const secondLastElement = paths[paths.length - 2];
  const remainder = paths.slice(0, paths.length - 2);

  return path.join(dir, ...[...remainder, `${secondLastElement}${lastElement}`]);
};

// Working directory
let internalCwd = fs.realpathSync(process.cwd());
let internalCoreCwd = fs.realpathSync(process.cwd());

/**
 * Sets the working directory
 * @param p the path to set
 */
export const setCwd = (p: string): void => {
  internalCwd = p;
  _setRequirePaths(path.join(internalCwd, 'node_modules'));
};

/**
 * Returns the working directory
 */
export const getCwd = (): string => internalCwd;

/**
 * Sets the core working directory
 * @param p the path to set
 */
export const setCoreCwd = (p: string): void => {
  internalCoreCwd = p;
  _setRequirePaths(path.join(internalCoreCwd, 'node_modules'));
};

/**
 * The core cwd is the working directory of core packages such as flex-plugin-scripts and flex-plugin
 */
export const getCoreCwd = (): string => internalCoreCwd;

/**
 * Reads a JSON file (Templated)
 *
 * @param filePath  the file path to read
 */
export const readJsonFile = <T>(filePath: string): T => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

/**
 * Gets the CLI paths. This is separated out from getPaths because create-flex-plugin also needs to read it,
 * but that script will not have flex-plugin-scripts installed which would cause an exception to be thrown.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getCliPaths = () => {
  const coreCwd = getCoreCwd();
  const coreNodeModulesDir = resolveRelative(coreCwd, 'node_modules');
  const homeDir = homedir();
  const cliDir = resolveRelative(homeDir, '/.twilio-cli');
  const flexDir = resolveRelative(cliDir, 'flex');

  return {
    dir: cliDir,
    nodeModulesDir: coreNodeModulesDir,
    flexDir,
    pluginsJsonPath: resolveRelative(flexDir, 'plugins.json'),
  };
};

// Read plugins.json from Twilio CLI
export const readPluginsJson = (): CLIFlexConfiguration =>
  readJsonFile<CLIFlexConfiguration>(getCliPaths().pluginsJsonPath);

/**
 * Writes an object as a JSON string to the file
 * @param pth the path to write to
 * @param obj the object to write
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const writeJSONFile = (pth: string, obj: object): void => fs.writeFileSync(pth, JSON.stringify(obj, null, 2));

// The OS root directory
const rootDir = os.platform() === 'win32' ? getCwd().split(path.sep)[0] : '/';

/*
 * Promise version of {@link copyTempDir}
 */
const promiseCopyTempDir = promisify(_require('copy-template-dir'));

/**
 * Checks the provided array of files exist
 *
 * @param files the files to check that they exist
 */
export const checkFilesExist = (...files: string[]): boolean => {
  return files.map(fs.existsSync).every((resp) => resp);
};

/**
 * Gets package.json path
 */
export const getPackageJsonPath = (): string => path.join(getCwd(), packageJsonStr);

/**
 * Reads app package.json from the rootDir.
 */
export const readAppPackageJson = (): AppPackageJson => {
  return readPackageJson(getPackageJsonPath()) as AppPackageJson;
};

/**
 * Updates the package.json version field
 *
 * @param version the new version
 */
export const updateAppVersion = (version: string): void => {
  const packageJson = readAppPackageJson();
  packageJson.version = version;

  fs.writeFileSync(getPackageJsonPath(), JSON.stringify(packageJson, null, 2));
};

/**
 * Finds the closest up file relative to dir
 *
 * @param dir   the directory
 * @param file  the file to look for
 */
export const findUp = (dir: string, file: string): string => {
  const resolved = path.resolve(dir);

  if (resolved === rootDir) {
    throw new Error(`Reached OS root directory without finding ${file}`);
  }

  const filePath = path.join(resolved, file);
  if (fs.existsSync(filePath)) {
    return filePath;
  }

  return findUp(path.resolve(resolved, '..'), file);
};

/**
 * Reads the file
 * @param filePath  the file path
 */
export const readFileSync = (filePath: string): string => fs.readFileSync(filePath, 'utf8');

/**
 * mkdir -p wrapper
 */
export const mkdirpSync = mkdirp.sync;

/**
 * Copies a template by applying the variables
 *
 * @param source    the source
 * @param target    the target
 * @param variables the variables
 */
/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/ban-types
export const copyTemplateDir = async (source: string, target: string, variables: object): Promise<unknown> => {
  return promiseCopyTempDir(source, target, variables);
};

/**
 * rm -rf sync script
 */
export const rmRfSync = rimRaf.sync;

/**
 * Builds path relative to cwd
 * @param paths  the paths
 */
export const resolveCwd = (...paths: string[]): string => resolveRelative(getCwd(), ...paths);

/**
 * Finds globs in any cwd directory
 * @param dir     the cwd to check for patterns
 * @param patterns the patterns
 */
export const findGlobsIn = (dir: string, ...patterns: string[]): string[] => {
  return globby.sync(patterns, { cwd: dir });
};

/**
 * Finds globs in the src directory
 * @param patterns the patterns
 */
export const findGlobs = (...patterns: string[]): string[] => {
  return findGlobsIn(path.join(getCwd(), 'src'), ...patterns);
};

/**
 * Touch ~/.twilio-cli/flex/plugins.json if it does not exist
 * Check if this plugin is in this config file. If not, add it.
 * @param name  the plugin name
 * @param dir   the plugin directory
 * @param promptForOverwrite  whether to prompt for overwrite
 * @return whether the plugin-directory was overwritten
 */
export const checkPluginConfigurationExists = async (
  name: string,
  dir: string,
  promptForOverwrite = false,
): Promise<boolean> => {
  const cliPaths = getCliPaths();
  if (!checkFilesExist(cliPaths.pluginsJsonPath)) {
    mkdirpSync(cliPaths.flexDir);
    writeJSONFile(cliPaths.pluginsJsonPath, { plugins: [] });
  }

  const config = readPluginsJson();
  const plugin = config.plugins.find((p) => p.name === name);

  if (!plugin) {
    config.plugins.push({ name, dir, port: 0 });
    writeJSONFile(cliPaths.pluginsJsonPath, config);
    return true;
  }

  if (plugin.dir === dir) {
    return false;
  }

  const answer = promptForOverwrite
    ? await confirm(
        `You already have a plugin called ${plugin.name} located at ${plugin.dir}. Do you want to update it to ${dir}?`,
        'N',
      )
    : true;

  if (answer) {
    plugin.dir = dir;
    writeJSONFile(cliPaths.pluginsJsonPath, config);
    return true;
  }

  return false;
};

/**
 * Adds the node_modules to the app module.
 * This is needed because we spawn different scripts when running start/build/test and so we lose
 * the original cwd directory
 */
export const addCWDNodeModule = (...args: string[]): void => {
  const indexCoreCwd = args.indexOf('--core-cwd');
  if (indexCoreCwd !== -1) {
    const coreCwd = args[indexCoreCwd + 1];
    if (coreCwd) {
      setCoreCwd(coreCwd);
    }
  }

  const indexCwd = args.indexOf('--cwd');
  if (indexCwd === -1) {
    // This is to setup the app environment
    setCwd(getCwd());
  } else {
    const cwd = args[indexCwd + 1];
    if (cwd) {
      setCwd(cwd);
    }
  }
};

/**
 * Returns the absolute path to the pkg if found
 * @param pkg the package to lookup
 */
/* istanbul ignore next */
export const resolveModulePath = (pkg: string, ...paths: string[]): string | false => {
  try {
    return require.resolve(pkg);
  } catch {
    // Now try to specifically set the node_modules path
    const requirePaths: string[] = (require.main && require.main.paths) || [];
    requirePaths.push(...paths);
    try {
      return require.resolve(pkg, { paths: requirePaths });
    } catch {
      return false;
    }
  }
};

/* istanbul ignore next */
export const _getFlexPluginScripts = (): string => {
  const flexPluginScriptPath = resolveModulePath('flex-plugin-scripts');
  if (flexPluginScriptPath === false) {
    throw new Error('Could not resolve flex-plugin-scripts');
  }

  return path.join(path.dirname(flexPluginScriptPath), '..');
};

/* istanbul ignore next */
export const _getFlexPluginWebpackPath = (scriptsNodeModulesDir: string): string => {
  const flexPluginWebpackPath = resolveModulePath('flex-plugin-webpack', scriptsNodeModulesDir);
  if (flexPluginWebpackPath === false) {
    throw new Error(`Could not resolve flex-plugin-webpack`);
  }

  return path.join(path.dirname(flexPluginWebpackPath), '..');
};

/**
 * Returns the paths to all modules and directories used in the plugin-builder
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getPaths = () => {
  const cwd = getCwd();
  const nodeModulesDir = resolveCwd('node_modules');
  const scriptsDir = _getFlexPluginScripts();
  const scriptsNodeModulesDir = resolveRelative(scriptsDir, 'node_modules');
  const devAssetsDir = resolveRelative(scriptsDir, 'dev_assets');
  const publicDir = resolveCwd('public');
  const buildDir = resolveCwd('build');
  const srcDir = resolveCwd('src');
  const flexUIDir = resolveRelative(nodeModulesDir, '@twilio/flex-ui');
  const tsConfigPath = resolveCwd('tsconfig.json');
  const webpackDir = _getFlexPluginWebpackPath(scriptsNodeModulesDir);

  // package.json information
  let pkgName = '';
  let pkgVersion = '';
  // This file can be required in locations that don't have package.json

  try {
    const pkg: PackageJson = readAppPackageJson();
    pkgName = pkg.name;
    pkgVersion = pkg.version;
  } catch (e) {
    // no-op
  }

  return {
    cwd,

    // flex-plugin-webpack paths
    webpack: {
      dir: webpackDir,
      nodeModulesDir: resolveRelative(webpackDir, 'node_modules'),
    },

    // flex-plugin-scripts paths
    scripts: {
      dir: scriptsDir,
      nodeModulesDir: scriptsNodeModulesDir,
      devAssetsDir,
      indexHTMLPath: resolveRelative(devAssetsDir, 'index.html'),
      tsConfigPath: resolveRelative(devAssetsDir, 'tsconfig.json'),
    },

    // twilio-cli/flex/plugins.json paths
    cli: getCliPaths(),

    // plugin-app (the customer app)
    app: {
      dir: cwd,
      name: pkgName,
      version: pkgVersion,
      pkgPath: resolveCwd(packageJsonStr),
      jestConfigPath: resolveCwd('jest.config.js'),
      webpackConfigPath: resolveCwd('webpack.config.js'),
      devServerConfigPath: resolveCwd('webpack.dev.js'),
      tsConfigPath,
      isTSProject: () => checkFilesExist(tsConfigPath),
      setupTestsPaths: [resolveCwd('setupTests.js'), resolveRelative(srcDir, 'setupTests.js')],

      // .env file support
      envPath: resolveCwd('/.env'),
      hasEnvFile: () => checkFilesExist(resolveCwd('/.env')),
      envExamplePath: resolveCwd('/.env.example'),
      hasEnvExampleFile: () => checkFilesExist(resolveCwd('/.env.example')),
      envDefaultsPath: resolveCwd('/.env.defaults'),
      hasEnvDefaultsPath: () => checkFilesExist(resolveCwd('/.env.defaults')),

      // build/*
      buildDir,
      bundlePath: resolveRelative(buildDir, pkgName, '.js'),
      sourceMapPath: resolveRelative(buildDir, pkgName, '.js.map'),

      // src/*
      srcDir,
      entryPath: resolveRelative(srcDir, 'index'),

      // node_modules/*,
      nodeModulesDir,
      flexUIDir,
      flexUIPkgPath: resolveRelative(flexUIDir, packageJsonStr),

      // public/*
      publicDir,
      appConfig: resolveRelative(publicDir, 'appConfig.js'),

      // dependencies
      dependencies: {
        react: {
          version: readPackageJson(resolveRelative(nodeModulesDir, 'react', packageJsonStr)).version,
        },
        reactDom: {
          version: readPackageJson(resolveRelative(nodeModulesDir, 'react-dom', packageJsonStr)).version,
        },
        flexUI: {
          version: readPackageJson(resolveRelative(nodeModulesDir, '@twilio/flex-ui', packageJsonStr)).version,
        },
      },
    },

    // others
    assetBaseUrlTemplate: `/plugins/${pkgName}/%PLUGIN_VERSION%`,
    extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
  };
};

/**
 * Returns the version of the dependency that is installed in node_modules
 * @param pkgName  the package name
 * @return the version of the package installed
 */
/* istanbul ignore next */
// eslint-disable-next-line import/no-unused-modules
export const getDependencyVersion = (pkgName: string): string => {
  try {
    return _require(`${pkgName}/package.json`).version;
  } catch {
    try {
      return _require(resolveRelative(getPaths().app.nodeModulesDir, pkgName, packageJsonStr)).version;
    } catch {
      return _require(resolveRelative(getPaths().scripts.nodeModulesDir, pkgName, packageJsonStr)).version;
    }
  }
};

/**
 * Returns the package.json version field of the package
 * @param name  the package
 */
/* istanbul ignore next */
export const getPackageVersion = (name: string): string => {
  const installedPath = resolveRelative(getPaths().app.nodeModulesDir, name, packageJsonStr);

  return readPackageJson(installedPath).version;
};
