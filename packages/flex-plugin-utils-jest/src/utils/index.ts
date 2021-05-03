import path from 'path';
import os from 'os';

/**
 * Returns if platform is windows
 */
export const isWin = (): boolean => os.platform() === 'win32';

/**
 * Normalizes the path
 * @param parts
 */
export const normalizePath = (...parts: string[]): string => {
  let normalized = path.normalize(path.join(...parts));
  if (isWin() && parts[0].charAt(0) === '/') {
    normalized = `C:${normalized}`;
  }

  return normalized;
};
