import path from 'path';
import os from 'os';

import { AsymmetricMatcher } from './AsymmetricMatcher';
import * as utils from '../utils';

export class ToMatchPath extends AsymmetricMatcher<string> {
  constructor(actual: string, inverse: boolean = false) {
    super(actual);

    this.inverse = inverse;
  }

  asymmetricMatch(expected: string): boolean {
    return this.actual === utils.normalizePath(expected);
  }

  match(expected: string): jest.CustomMatcherResult {
    const pass = this.asymmetricMatch(expected);
    return {
      pass,
      message: pass ? this.passMessage(this.actual, expected) : this.failMessage(this.actual, expected),
    };
  }

  method(): string {
    return 'toMatchPath';
  }

  toString(): string {
    return 'ToMatchPath';
  }
}

export default (actual: string): ToMatchPath => new ToMatchPath(actual);
