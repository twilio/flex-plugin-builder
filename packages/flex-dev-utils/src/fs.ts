import fs from 'fs';
import { join } from 'path';
import * as path from 'path';
import os from 'os';
import mkdirp from 'mkdirp';
import tmp, { DirResult as TmpDirResult } from 'tmp';
import { promisify } from 'util';
import rimRaf from 'rimraf';

export interface PackageJson {
  name: string;
  version: string;
  dependencies: {
    'flex-plugin': string;
    'flex-plugin-scripts': string;
    'craco-config-flex-plugin': string;
  };
}

export default fs;

// The OS root directory
const rootDir = os.platform() === 'win32' ? process.cwd().split(path.sep)[0] : '/';

// Promise version of {@link copyTempDir}
// tslint:disable-next-line
const promiseCopyTempDir = promisify(require('copy-template-dir'));

// Node directory
const nodeModulesPath = join(process.cwd(), 'node_modules');

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
  return require(join(nodeModulesPath, pkgName, 'package.json')).version;
};

export { DirResult as TmpDirResult } from 'tmp';
