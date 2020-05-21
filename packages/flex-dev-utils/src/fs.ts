import fs from 'fs';
import * as path from 'path';
import globby from 'globby';
import os from 'os';
import mkdirp from 'mkdirp';
import tmp from 'tmp';
import copyTempDir from 'copy-template-dir';
import { promisify } from 'util';
import rimRaf from 'rimraf';

export interface PackageJson {
  name: string;
  version: string;
  dependencies: {
    'flex-plugin': string;
    'flex-plugin-scripts': string;
  };
}

export default fs;

// Working directory
const cwd = fs.realpathSync(process.cwd());

// The OS root directory
const rootDir = os.platform() === 'win32' ? process.cwd().split(path.sep)[0] : '/';

// Promise version of {@link copyTempDir}
const promiseCopyTempDir = promisify(copyTempDir);

// Node directory
const nodeModulesPath = path.join(process.cwd(), 'node_modules');

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
export const getPackageJsonPath = (forModule: boolean = false) => path.join(process.cwd(), 'package.json');

/**
 * Updates the package.json version field
 *
 * @param version the new version
 */
export const updatePackageVersion = (version: string) => {
  const packageJson = readPackageJson();
  packageJson.version = version;

  fs.writeFileSync(getPackageJsonPath(), JSON.stringify(packageJson, null, 2));
};

/**
 * Reads package.json from the rootDir. This is the package.json of the service running the script.
 * For example, if a plugin is using a method of flex-plugin-scripts which is calling this, then
 * the plugin's package.json is returned
 *
 * @param pkgPath   the package.json to read
 */
export const readPackageJson = (pkgPath: string = getPackageJsonPath()): PackageJson => {
  return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
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
  return require(path.join(nodeModulesPath, pkgName, 'package.json')).version;
};

/**
 * Builds path relative to cwd
 * @param paths  the paths
 */
export const resolveCwd = (...paths: string[]) => resolveRelative(cwd, ...paths);

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
  return findGlobsIn(path.join(process.cwd(), 'src'), ...patterns);
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
