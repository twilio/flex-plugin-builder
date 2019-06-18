import fs from 'fs';
import * as path from 'path';

export default fs;

/**
 * Reads package.json
 */
export const readPackageJson = () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
};
