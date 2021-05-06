import path from 'path';

import { AsymmetricMatcher } from './AsymmetricMatcher';

export class ToMatchPathContaining extends AsymmetricMatcher<string> {
  constructor(actual: string, inverse: boolean = false) {
    super(actual);

    this.inverse = inverse;
  }

  asymmetricMatch(expected: string): boolean {
    return this.actual.includes(path.normalize(expected));
  }

  match(expected: string): jest.CustomMatcherResult {
    const pass = this.asymmetricMatch(expected);
    return {
      pass,
      message: pass ? this.passMessage(this.actual, expected) : this.failMessage(this.actual, expected),
    };
  }

  method(): string {
    return 'toMatchPathContaining';
  }

  toString(): string {
    return 'ToMatchPathContaining';
  }
}

export default (actual: string): ToMatchPathContaining => new ToMatchPathContaining(actual);
