declare global {
    interface Window {
        Twilio?: {
            Flex: {
                Manager: {
                    getInstance(): {
                        configuration: {
                            logLevel: string;
                            sdkOptions?: {
                                chat?: {
                                    region?: string;
                                };
                            };
                        };
                    };
                };
            };
        };
    }
}
export declare type Region = 'dev' | 'stage';
export declare enum Environment {
    Production = "production",
    Development = "development",
    Test = "test"
}
export declare enum Lifecycle {
    Test = "test",
    Build = "build",
    Prebuild = "prebuild",
    Deploy = "deploy",
    Predeploy = "predeploy"
}
export declare const isNode: () => boolean;
export declare const isWin32: () => boolean;
/**
 * Internal method for setting process.env
 * This is used to bypass terser library that does `process.env.FOO` string replacement
 * @param key the key to set
 * @param value the value set it to
 */
export declare const setProcessEnv: <T>(key: string, value: T) => void;
/**
 * Internal method for getting the process.env
 * @param key the key to get
 */
export declare const getProcessEnv: <T>(key: string) => T;
export declare const hasHttpProxy: () => boolean;
export declare const getHttpProxy: () => string;
export declare const setHttpProxy: (host: string) => void;
export declare const skipPreflightCheck: () => boolean;
export declare const getAccountSid: () => string | undefined;
export declare const getAuthToken: () => string | undefined;
export declare const hasHost: () => boolean;
export declare const getHost: () => string | undefined;
export declare const setHost: (host: string) => void;
export declare const hasPort: () => boolean;
export declare const getPort: () => number;
export declare const setPort: (port: number) => void;
export declare const getFlexUISrc: () => string | undefined;
export declare const setFlexUISrc: (source: string) => void;
export declare const getNodeEnv: () => string;
export declare const setNodeEnv: (_env: Environment) => void;
export declare const getBabelEnv: () => string;
export declare const setBabelEnv: (_env: Environment) => void;
export declare const getLifecycle: () => string;
export declare const isLifecycle: (cycle: Lifecycle) => boolean;
export declare const isHTTPS: () => boolean;
export declare const setWDSSocketHost: (host: string) => void;
export declare const getWDSSocketHost: () => string | undefined;
export declare const setWDSSocketPath: (path: string) => void;
export declare const getWDSSocketPath: () => string | undefined;
export declare const setWDSSocketPort: (port: number) => void;
export declare const getWDSSocketPort: () => number;
export declare const getWSSocket: () => Record<string, string | undefined>;
export declare const isCI: () => boolean;
/**
 * Sets the Twilio Profile
 * @param profile the profile to set
 */
export declare const setTwilioProfile: (profile: string) => void;
/**
 * Returns the Twilio Profile
 */
export declare const getTwilioProfile: () => string | undefined;
/**
 * Sets the environment to persist the terminal
 */
export declare const persistTerminal: () => void;
/**
 * Determines if the terminal should be persisted or not
 */
export declare const isTerminalPersisted: () => boolean;
/**
 * Determines whether script should run in quiet mode
 */
export declare const isQuiet: () => boolean;
/**
 * Sets the quiet mode
 */
export declare const setQuiet: (isQuiet?: boolean) => void;
/**
 * Returns true if the caller is the CLI
 */
export declare const isCLI: () => boolean;
/**
 * Sets the caller to be the CLI
 */
export declare const setCLI: () => void;
/**
 * Determines if log level should be trace level
 */
export declare const isTrace: () => boolean;
/**
 * Sets the debug mode
 */
export declare const setDebug: (isDebug?: boolean) => void;
/**
 * Returns true if running in debug verbose mode
 */
export declare const isDebug: () => boolean;
/**
 * Sets the region
 */
export declare const setRegion: (region: Region) => void;
/**
 * Returns the region
 */
export declare const getRegion: () => Region | string;
declare const _default: {
    setProcessEnv: <T>(key: string, value: T) => void;
    getProcessEnv: <T_1>(key: string) => T_1;
    isNode: () => boolean;
    isWin32: () => boolean;
    persistTerminal: () => void;
    hasHttpProxy: () => boolean;
    getHttpProxy: () => string;
    skipPreflightCheck: () => boolean;
    isTerminalPersisted: () => boolean;
    setTwilioProfile: (profile: string) => void;
    getTwilioProfile: () => string | undefined;
    isQuiet: () => boolean;
    setQuiet: (isQuiet?: boolean) => void;
    isCLI: () => boolean;
    setCLI: () => void;
    isCI: () => boolean;
    setDebug: (isDebug?: boolean) => void;
    isDebug: () => boolean;
    isTrace: () => boolean;
    getAccountSid: () => string | undefined;
    getAuthToken: () => string | undefined;
    getRegion: () => string;
    setRegion: (region: Region) => void;
    hasHost: () => boolean;
    getHost: () => string | undefined;
    setHost: (host: string) => void;
    hasPort: () => boolean;
    getPort: () => number;
    setPort: (port: number) => void;
    getFlexUISrc: () => string | undefined;
    setFlexUISrc: (source: string) => void;
    getNodeEnv: () => string;
    setNodeEnv: (_env: Environment) => void;
    getBabelEnv: () => string;
    setBabelEnv: (_env: Environment) => void;
    getLifecycle: () => string;
    isLifecycle: (cycle: Lifecycle) => boolean;
    isHTTPS: () => boolean;
    getWDSSocketHost: () => string | undefined;
    setWDSSocketHost: (host: string) => void;
    getWDSSocketPath: () => string | undefined;
    setWDSSocketPath: (path: string) => void;
    setWDSSocketPort: (port: number) => void;
    getWDSSocketPort: () => number;
    getWSSocket: () => Record<string, string | undefined>;
};
export default _default;
