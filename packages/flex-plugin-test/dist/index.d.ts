import { InitialOptions } from '@jest/types/build/Config';
interface RegexObject {
    [regex: string]: string;
}
export interface JestConfigurations extends Partial<InitialOptions> {
    roots: string[];
    collectCoverageFrom: string[];
    setupFiles: string[];
    setupFilesAfterEnv: string[];
    testMatch: string[];
    transform: RegexObject;
    transformIgnorePatterns: string[];
    moduleNameMapper: RegexObject;
    moduleFileExtensions: string[];
    watchPlugins: string[];
}
declare const _default: () => JestConfigurations;
/**
 * Main method for generating a default Jest configuration
 */
export default _default;
