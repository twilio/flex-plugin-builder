declare const _default: {
    equal: (actual: any, expected: any, msg?: string | undefined) => void;
    fileExists: (paths: string[], msg?: string | undefined) => void;
    jsonFileContains: <T>(paths: string[], key: string, value: T, msg?: string | undefined) => void;
    fileContains: (paths: string[], value: string, msg?: string | undefined) => void;
    dirIsEmpty: (paths: string[], msg?: string | undefined) => void;
    stringContains: (line: string, str: string, msg?: string | undefined) => void;
    not: {
        fileExists: (paths: string[], msg?: string | undefined) => void;
        jsonFileContains: <T>(paths: string[], key: string, value: T, msg?: string | undefined) => void;
        fileContains: (paths: string[], value: string, msg?: string | undefined) => void;
        dirIsEmpty: (paths: string[], msg?: string | undefined) => void;
        stringContains: (line: string, str: string, msg?: string | undefined) => void;
        equal: (actual: any, expected: any, msg?: string | undefined) => void;
    };
};
export default _default;
