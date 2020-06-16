import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Checks files exist
 * @param files the path to files to check
 * @returns {boolean}
 */
export const filesExist = (...files: string[]) => files.map(existsSync).every(Boolean);

/**
 * Reads and parses a JSON file
 * @param paths
 * @returns {any}
 */
export const readJSONFile = (...paths: string[]) => JSON.parse(readFileSync(join(...paths), 'utf8'));
