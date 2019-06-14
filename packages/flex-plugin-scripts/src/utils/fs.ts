import fs from 'fs';
import * as path from 'path';

const packageJsonPath = path.join(process.cwd(), 'package.json');

/**
 * Checks the provided array of files exist
 *
 * @param files the files to check that they exist
 */
export const checkFilesExist = (files: string[]) => {
  return files
    .map(fs.existsSync)
    .every((resp) => resp);
};

/**
 * Checks the file exist
 *
 * @param file  the file to check that exists
 */
export const checkFileExists = (file: string) => checkFilesExist([file]);

/**
 * Updates the package.json version field
 *
 * @param version the new version
 */
export const updatePackageVersion = (version: string) => {
  const packageJson = readPackage();
  packageJson.version = version;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

/**
 * Reads package.json
 */
export const readPackage = () => {
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
};
