/// <reference types="jest" />
/**
 * Abstract class for writing asymmetric matchers
 */
export declare abstract class AsymmetricMatcher<T> implements jest.AsymmetricMatcher {
    $$typeof: symbol;
    inverse?: boolean;
    protected actual: T;
    protected constructor(actual: T);
    toAsymmetricMatcher(): string;
    protected passMessage: (actual: string, expected: string) => () => string;
    protected failMessage: (actual: string, expected: string) => () => string;
    abstract method(): string;
    abstract asymmetricMatch(other: T): boolean;
    abstract match(other?: T): jest.CustomMatcherResult;
}
