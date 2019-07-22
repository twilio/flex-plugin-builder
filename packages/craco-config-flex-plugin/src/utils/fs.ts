import { join } from 'path';

/**
 * Attempts to load the file from rootDir
 *
 * @param rootDir   the root directory
 * @param fileName  the file name
 */
export const loadFile = (rootDir: string, fileName: string) => {
  try {
    return require(join(rootDir, fileName));
  } catch (e) {
    return null;
  }
};
