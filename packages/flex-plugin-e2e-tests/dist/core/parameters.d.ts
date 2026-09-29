interface ConsoleAuthOptions {
    email: string;
    password: string;
}
interface Hidden {
    __hidden: boolean;
}
export interface PluginType {
    name: string;
    dir: string;
    componentText: string;
    localhostUrl: string;
}
export interface TestScenario {
    packageVersion: string;
    plugins: (PluginType & Partial<{
        newlineValue: string;
        changelog: string;
        version: string;
    }>)[];
    flexUIVersion?: string;
    reactVersion?: string;
    isTS?: boolean;
}
export interface TestParams {
    environment: {
        nodeVersion: string;
        homeDir: string;
        path: string;
        operatingSystem: string;
        cwd: string;
        ignorePrefix: boolean;
        nodeOptions: string | undefined;
    } & Hidden;
    secrets: {
        console: ConsoleAuthOptions;
        api: {
            accountSid: string;
            authToken: string;
        };
    } & Hidden;
    config: {
        start: {
            timeout: number;
            pollInterval: number;
        };
        consoleBaseUrl: string;
        hostedFlexBaseUrl: string;
        localhostPort: number;
        region?: string;
        regionFlag: string[];
    } & Hidden;
    scenario: TestScenario & Hidden;
}
export declare const homeDir: string;
export declare const testParams: TestParams;
export declare const testScenarios: Partial<TestScenario>[];
export {};
