import path from 'path';

import { AsymmetricMatcher } from './utils';

export class ToMatchPath extends AsymmetricMatcher<string> {
  constructor(actual: string, inverse: boolean = false) {
    super(actual);

    this.inverse = inverse;
  }

  asymmetricMatch(expected: string): boolean {
    return this.actual === path.normalize(expected).replace('C:', '');
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
