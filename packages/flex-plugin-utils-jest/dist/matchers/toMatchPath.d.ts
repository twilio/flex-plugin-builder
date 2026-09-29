/// <reference types="jest" />
import { AsymmetricMatcher } from './AsymmetricMatcher';
export declare class ToMatchPath extends AsymmetricMatcher<string> {
    constructor(actual: string, inverse?: boolean);
    asymmetricMatch(expected: string): boolean;
    match(expected: string): jest.CustomMatcherResult;
    method(): string;
    toString(): string;
}
declare const _default: (actual: string) => ToMatchPath;
export default _default;
