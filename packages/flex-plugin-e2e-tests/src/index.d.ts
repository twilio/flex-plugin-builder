export interface TestParams {
    packageVersion: string;
    nodeVersion: string;
    homeDir: string;
    plugin: {
        name: string;
        dir: string;
    } & Partial<TestParamsBuilder>;
}
interface TestParamsBuilder {
    newlineValue: string;
    changelog: string;
    version: string;
}
export interface TestSuite {
    description: string;
    (params: TestParams): Promise<void>;
}
export declare const homeDir: string;
export {};
