import { DefinePlugin } from 'webpack';
declare type CodeValueObject = {
    [key: string]: DefinePlugin.CodeValueObject;
};
declare type ProcessEnv = {
    [key: string]: string | undefined;
};
interface SanitizedProcessEnv {
    'process.env': CodeValueObject;
}
/**
 * Reads the .env file and process it. It will print warning messages if the format is invalid
 * @param filename  the filename to read
 * @param path      the path to the file
 */
export declare const _readEnvFile: (filename: string, path: string) => ProcessEnv;
/**
 * Filters and sanitizes the variables
 * @param variables the variables to read
 */
export declare const _filterVariables: (variables: CodeValueObject) => CodeValueObject;
/**
 * Reads the .env files and sanitizes and only returns allowed keys
 */
export declare const getSanitizedProcessEnv: () => SanitizedProcessEnv;
export {};
