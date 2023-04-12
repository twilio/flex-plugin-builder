import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';

/**
 * Abstract class for writing asymmetric matchers
 */
/* c8 ignore next */
export abstract class AsymmetricMatcher<T> implements jest.AsymmetricMatcher {
  $$typeof: symbol;

  inverse?: boolean;

  protected actual: T;

  protected constructor(actual: T) {
    this.$$typeof = Symbol.for('jest.asymmetricMatcher');
    this.actual = actual;
  }

  toAsymmetricMatcher(): string {
    return `${this.toString()}<${this.actual}>`;
  }

  protected passMessage = (actual: string, expected: string) => (): string =>
    `${matcherHint(`.not.${this.method()}`)}

Expected value not to match:
  ${printExpected(expected)}
Received:
  ${printReceived(actual)}`;

  protected failMessage = (actual: string, expected: string) => (): string =>
    `${matcherHint(`.${this.method()}`)}

Expected value to match:
  ${printExpected(expected)}
Received:
  ${printReceived(actual)}`;

  abstract method(): string;

  abstract asymmetricMatch(other: T): boolean;

  abstract match(other?: T): jest.CustomMatcherResult;
}
