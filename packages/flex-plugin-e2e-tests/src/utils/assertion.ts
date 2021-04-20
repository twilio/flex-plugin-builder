import { strictEqual, notStrictEqual } from 'assert';
import * as path from 'path';
import * as fs from 'fs';

import { get } from 'lodash';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _strictEqual = (doesEqual: boolean, actual: any, expected: any, msg?: string): void => {
  if (doesEqual) {
    strictEqual(actual, expected, msg);
  } else {
    notStrictEqual(actual, expected, msg);
  }
};

const fileExists = (negate: boolean) => (paths: string[], msg?: string): void => {
  _strictEqual(negate, true, fs.existsSync(path.join(...paths)), msg);
};

const jsonFileContains = (negate: boolean) => <T>(paths: string[], key: string, value: T, msg?: string) => {
  _strictEqual(negate, value, get(JSON.parse(fs.readFileSync(path.join(...paths), 'utf-8')), key), msg);
};

export default {
  strictEqual,
  fileExists: fileExists(true),
  jsonFileContains: jsonFileContains(true),
  not: {
    fileExists: fileExists(false),
    jsonFileContains: jsonFileContains(false),
    strictEqual: notStrictEqual,
  },
};
