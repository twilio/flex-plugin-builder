import { TestParams } from './parameters';
export interface TestSuite {
    (params: TestParams): Promise<void>;
    description: string;
    before?: (params: TestParams) => Promise<void>;
    after?: (params: TestParams) => Promise<void>;
}
/**
 * All the test suites that need to run
 */
export declare const testSuites: string[];
