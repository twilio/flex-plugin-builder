/// <reference types="jest" />
import { AsymmetricMatcher } from './AsymmetricMatcher';
export declare class ToMatchPathContaining extends AsymmetricMatcher<string> {
    constructor(actual: string, inverse?: boolean);
    asymmetricMatch(expected: string): boolean;
    match(expected: string): jest.CustomMatcherResult;
    method(): string;
    toString(): string;
}
declare const _default: (actual: string) => ToMatchPathContaining;
export default _default;
