import fs from 'fs';
import * as path from 'path';
import globby from 'globby';
import os, { homedir } from 'os';
import mkdirp from 'mkdirp';
import tmp from 'tmp';
import { promisify } from 'util';
import rimRaf from 'rimraf';

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
  plugins: FlexConfigurationPlugin[]
}

export default fs;

// Working directory
let internalCwd = fs.realpathSync(process.cwd());

// Set working directory
export const setCwd = (p: string) => internalCwd = p;

// Get working directory
export const getCwd = () => internalCwd;

// Read plugins.json from Twilio CLI
export const readPluginsJson = () => readJsonFile<CLIFlexConfiguration>(getPaths().cli.pluginsJsonPath);

// Write to json file
export const writeJSONFile = (pth: string, obj: object) => fs.writeFileSync(pth, JSON.stringify(obj, null, 2));

// The OS root directory
const rootDir = os.platform() === 'win32' ? getCwd().split(path.sep)[0] : '/';

// Promise version of {@link copyTempDir}
// tslint:disable-next-line
const promiseCopyTempDir = promisify(require('copy-template-dir'));

/**
 * Checks the provided array of files exist
 *
 * @param files the files to check that they exist
 */
export const checkFilesExist = (...files: string[]) => {
  return files
    .map(fs.existsSync)
    .every((resp) => resp);
};

/**
 * Gets package.json path
 */
export const getPackageJsonPath = (forModule: boolean = false) => path.join(getCwd(), 'package.json');

/**
 * Updates the package.json version field
 *
 * @param version the new version
 */
export const updateAppVersion = (version: string) => {
  const packageJson = readAppPackageJson();
  packageJson.version = version;

  fs.writeFileSync(getPackageJsonPath(), JSON.stringify(packageJson, null, 2));
};

/**
 * Reads app package.json from the rootDir.
 */
export const readAppPackageJson = (): AppPackageJson => {
  return readPackageJson(getPackageJsonPath()) as AppPackageJson;
}

/**
 * Reads a JSON file
 *
 * @param filePath   the file path to read
 */
export const readPackageJson = (filePath: string): PackageJson => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

/**
 * Reads a JSON file (Templated)
 *
 * @param filePath  the file path to read
 */
export const readJsonFile = <T> (filePath: string): T => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Returns the package.json version field of the package
 * @param name  the package
 */
/* istanbul ignore next */
export const getPackageVersion = (name: string) => {
  const installedPath = resolveRelative(getPaths().app.nodeModulesDir, name, 'package.json');

  return readPackageJson(installedPath).version;
}


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
export const copyTemplateDir = (source: string, target: string, variables: object) => {
  return promiseCopyTempDir(source, target, variables);
};

/**
 * Create a tmp directory
 */
export const tmpDirSync = tmp.dirSync;

/**
 * rm -rf sync script
 */
export const rmRfSync = rimRaf.sync;

/**
 * Returns the version of the dependency that is installed in node_modules
 * @param pkgName  the package name
 * @return the version of the package installed
 */
/* istanbul ignore next */
export const getDependencyVersion = (pkgName: string) => {
  return require(resolveRelative(getPaths().app.nodeModulesDir, pkgName, 'package.json')).version;
};

/**
 * Builds path relative to cwd
 * @param paths  the paths
 */
export const resolveCwd = (...paths: string[]) => resolveRelative(getCwd(), ...paths);

/**
 * Builds path relative to the given dir
 * @param dir   the dir
 * @param paths the paths
 */
export const resolveRelative = (dir: string, ...paths: string[]) => {
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

/**
 * Finds globs in the src directory
 * @param patterns the patterns
 */
export const findGlobs = (...patterns: string[]) => {
  // TODO: move paths from flex-plugin-scripts into here and use it here too
  return findGlobsIn(path.join(getCwd(), 'src'), ...patterns);
};

/**
 * Finds globs in any cwd directory
 * @param dir     the cwd to check for patterns
 * @param patterns the patterns
 */
export const findGlobsIn = (dir: string, ...patterns: string[]) => {
  return globby.sync(patterns, { cwd: dir });
};

export { DirResult as TmpDirResult } from 'tmp';

export const getPaths = () => {
  const cwd = getCwd();
  const nodeModulesDir = resolveCwd('node_modules');
  const scriptsDir = resolveRelative(nodeModulesDir, 'flex-plugin-scripts');
  const devAssetsDir = resolveRelative(scriptsDir, 'dev_assets');
  const publicDir = resolveCwd('public');
  const buildDir = resolveCwd('build');
  const srcDir = resolveCwd('src');
  const flexUIDir = resolveRelative(nodeModulesDir, '@twilio/flex-ui');
  const homeDir = homedir();
  const cliDir = resolveRelative(homeDir, 'twilio-cli');
  const flexDir = resolveRelative(cliDir, 'flex');
  const tsConfigPath = resolveCwd('tsconfig.json');

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

    // flex-plugin-scripts paths
    scripts: {
      dir: scriptsDir,
      devAssetsDir,
      indexHTMLPath: resolveRelative(devAssetsDir, 'index.html'),
      tsConfigPath: resolveRelative(devAssetsDir, 'tsconfig.json'),
    },

    // twilio-cli/flex/plugins.json paths
    cli: {
      dir: cliDir,
      flexDir,
      pluginsJsonPath: resolveRelative(flexDir, 'plugins.json'),
    },

    // plugin-app (the customer app)
    app: {
      dir: cwd,
      name: pkgName,
      version: pkgVersion,
      pkgPath: resolveCwd('package.json'),
      jestConfigPath: resolveCwd('jest.config.js'),
      webpackConfigPath: resolveCwd('webpack.config.js'),
      devServerConfigPath: resolveCwd('webpack.dev.js'),
      tsConfigPath,
      isTSProject: () => checkFilesExist(tsConfigPath),
      setupTestsPaths: [
        resolveCwd('setupTests.js'),
        resolveRelative(srcDir, 'setupTests.js'),
      ],

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
      flexUIPkgPath: resolveRelative(flexUIDir, 'package.json'),

      // public/*
      publicDir,
      indexHtmlPath: resolveRelative(publicDir, 'index.html'),
      appConfig: resolveRelative(publicDir, 'appConfig.js'),
      pluginsJsonPath: resolveRelative(publicDir, 'plugins.json'),
      pluginsServicePath: resolveRelative(publicDir, 'pluginsService.js'),
    },

    // others
    assetBaseUrlTemplate: `/plugins/${pkgName}/%PLUGIN_VERSION%`,
    extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
  };
}
