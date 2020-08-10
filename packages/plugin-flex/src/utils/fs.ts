import { existsSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

/**
 * Checks files exist
 * @param files the path to files to check
 * @returns {boolean}
 */
export const filesExist = (...files: string[]): boolean => files.map(existsSync).every(Boolean);

/**
 * Reads and parses a JSON file
 * @param paths
 * @returns {any}
 */
export const readJSONFile = (...paths: string[]) => JSON.parse(readFileSync(path.join(...paths), 'utf8'));

/**
 * (Templated) reads and parses a JSON file
 * @param paths
 * @returns {any}
 */
export const readJsonFile = <T>(...paths: string[]): T => JSON.parse(readFileSync(path.join(...paths), 'utf8'));

/**
 * Write to a JSON file
 * @param obj
 * @param paths
 */
export const writeJSONFile = (obj: Record<string, unknown>, ...paths: string[]) =>
  writeFileSync(path.join(...paths), JSON.stringify(obj, null, 2));
