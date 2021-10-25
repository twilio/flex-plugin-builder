/* eslint-disable @typescript-eslint/no-explicit-any */
import { deepStrictEqual, notDeepStrictEqual, deepEqual, notDeepEqual } from 'assert';
import * as path from 'path';
import * as fs from 'fs';

import { get } from 'lodash';

import { App } from './pages';

const _strictEqual = (doesEqual: boolean, actual: any, expected: any, msg?: string): void => {
  if (doesEqual) {
    deepStrictEqual(actual, expected, msg);
  } else {
    notDeepStrictEqual(actual, expected, msg);
  }
};

const equal =
  (doesEqual: boolean) =>
  (actual: any, expected: any, msg?: string): void => {
    _strictEqual(doesEqual, actual, expected, msg);
  };

/**
 * Checks whether a file/directory exists
 */
const fileExists =
  (doesEqual: boolean) =>
  (paths: string[], msg?: string): void => {
    _strictEqual(doesEqual, true, fs.existsSync(path.join(...paths)), msg);
  };

/**
 * Checks whether the JSON file contains the given key:value pair
 */
const jsonFileContains =
  (doesEqual: boolean) =>
  <T>(paths: string[], key: string, value: T, msg?: string) => {
    _strictEqual(doesEqual, value, get(JSON.parse(fs.readFileSync(path.join(...paths), 'utf-8')), key), msg);
  };

const stringContains = (doesEqual: boolean) => (line: string, str: string, msg?: string) => {
  _strictEqual(doesEqual, true, line.includes(str), msg);
};

/**
 * Checks whether the file contains the given string
 */
const fileContains = (doesEqual: boolean) => (paths: string[], value: string, msg?: string) => {
  const file = path.join(...paths);
  const not = doesEqual ? ' not ' : ' ';
  msg = msg || `${file} does${not}contain ${value}`;

  stringContains(doesEqual)(fs.readFileSync(file, 'utf-8'), value, msg);
};

/**
 * Checks whether the directory is empty
 */
const dirIsEmpty = (doesEqual: boolean) => (paths: string[], msg?: string) => {
  _strictEqual(doesEqual, 0, fs.readdirSync(path.join(...paths)).length, msg);
};

/**
 * Checks whether the object is null
 */
const isNull = (doesEqual: boolean) => (obj: any, msg?: string) => {
  if (doesEqual) {
    deepEqual(obj, null, msg);
  } else {
    notDeepEqual(obj, null, msg);
  }
};

/**
 * Checks whether the object is underfined
 */
const isUndefined = (doesEqual: boolean) => (obj: any, msg?: string) => {
  if (doesEqual) {
    deepEqual(obj, undefined, msg);
  } else {
    notDeepEqual(obj, undefined, msg);
  }
};

export default {
  equal: equal(true),
  fileExists: fileExists(true),
  jsonFileContains: jsonFileContains(true),
  fileContains: fileContains(true),
  dirIsEmpty: dirIsEmpty(true),
  stringContains: stringContains(true),
  isNull: isNull(true),
  isUndefined: isUndefined(true),
  not: {
    fileExists: fileExists(false),
    jsonFileContains: jsonFileContains(false),
    fileContains: fileContains(false),
    dirIsEmpty: dirIsEmpty(false),
    stringContains: stringContains(false),
    equal: equal(false),
    isNull: isNull(false),
    isUndefined: isUndefined(false),
  },
  app: (() => {
    let view: InstanceType<typeof App>['assert'];
    return {
      get view(): InstanceType<typeof App>['assert'] {
        if (view) {
          return view;
        }
        throw new Error('You must call init before accessing app assert');
      },
      init: (value: App) => {
        view = value.assert;
      },
    };
  })(),
};
