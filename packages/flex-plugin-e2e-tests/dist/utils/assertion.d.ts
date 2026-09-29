import { App } from './pages';
declare const _default: {
    equal: (actual: any, expected: any, msg?: string | undefined) => void;
    fileExists: (paths: string[], msg?: string | undefined) => void;
    jsonFileContains: <T>(paths: string[], key: string, value: T, msg?: string | undefined) => void;
    fileContains: (paths: string[], value: string, msg?: string | undefined) => void;
    dirIsEmpty: (paths: string[], msg?: string | undefined) => void;
    stringContains: (line: string, str: string, msg?: string | undefined) => void;
    isNull: (obj: any, msg?: string | undefined) => void;
    isUndefined: (obj: any, msg?: string | undefined) => void;
    not: {
        fileExists: (paths: string[], msg?: string | undefined) => void;
        jsonFileContains: <T>(paths: string[], key: string, value: T, msg?: string | undefined) => void;
        fileContains: (paths: string[], value: string, msg?: string | undefined) => void;
        dirIsEmpty: (paths: string[], msg?: string | undefined) => void;
        stringContains: (line: string, str: string, msg?: string | undefined) => void;
        equal: (actual: any, expected: any, msg?: string | undefined) => void;
        isNull: (obj: any, msg?: string | undefined) => void;
        isUndefined: (obj: any, msg?: string | undefined) => void;
    };
    app: {
        readonly view: {
            agentDesktop: {
                isVisible: () => Promise<import("puppeteer").ElementHandle<Node | Element>>;
            };
            adminDashboard: {
                isVisible: () => Promise<import("puppeteer").ElementHandle<Node | Element>>;
            };
            twilioConsole: {};
            plugins: {
                plugin: {
                    isVisible: (pluginText: string) => Promise<import("puppeteer").ElementHandle<Node | Element>>;
                };
            };
        };
        init: (value: App) => void;
    };
};
export default _default;
