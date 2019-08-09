import fs from 'fs';
import * as path from 'path';
import os from 'os';
import * as mkdirp from 'mkdirp';

export default fs;

const rootDir = os.platform() === 'win32' ? process.cwd().split(path.sep)[0] : '/';
const rootConfigDir = path.join(os.userInfo().homedir, '.flex', 'plugin-builder');

/**
 * Gets the root config directory
 */
export const getConfigDir = () => {
  if (fs.existsSync(rootConfigDir)) {
    return rootConfigDir;
  }

  if (mkdirp.sync(rootConfigDir)) {
    return rootConfigDir;
  }

  throw new Error(`Failed to create the root config directory at ${rootConfigDir}`);
};

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
export const readPackageJson = (pkgPath: string = getPackageJsonPath()) => {
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
    throw new Error(`Reached OS root directory without findin ${file}`);
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
