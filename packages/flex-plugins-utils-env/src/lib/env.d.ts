export declare type Realm = 'dev' | 'stage';
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
export declare const skipPreflightCheck: () => boolean;
export declare const allowUnbundledReact: () => boolean;
export declare const getAccountSid: () => string | undefined;
export declare const getAuthToken: () => string | undefined;
export declare const hasHost: () => boolean;
export declare const getHost: () => string | undefined;
export declare const setHost: (host: string) => string;
export declare const hasPort: () => boolean;
export declare const getPort: () => number;
export declare const setPort: (port: number) => string;
export declare const getNodeEnv: () => string;
export declare const setNodeEnv: (_env: Environment) => string;
export declare const getBabelEnv: () => string;
export declare const setBabelEnv: (_env: Environment) => string;
export declare const getLifecycle: () => string;
export declare const isLifecycle: (cycle: Lifecycle) => boolean;
export declare const isHTTPS: () => boolean;
export declare const setWDSSocketHost: (host: string) => string;
export declare const getWDSSocketHost: () => string | undefined;
export declare const setWDSSocketPath: (path: string) => string;
export declare const getWDSSocketPath: () => string | undefined;
export declare const setWDSSocketPort: (port: number) => string;
export declare const getWDSSocketPort: () => number;
export declare const getWSSocket: () => Record<string, string | undefined>;
export declare const isNode: () => boolean;
export declare const isWin32: () => boolean;
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
 * Sets the realm
 */
export declare const setRealm: (realm: Realm) => void;
/**
 * Returns the realm
 */
export declare const getRealm: () => Realm | string;
declare const _default: {
    isNode: () => boolean;
    isWin32: () => boolean;
    persistTerminal: () => void;
    skipPreflightCheck: () => boolean;
    allowUnbundledReact: () => boolean;
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
    getRealm: () => string;
    setRealm: (realm: Realm) => void;
    hasHost: () => boolean;
    getHost: () => string | undefined;
    setHost: (host: string) => string;
    hasPort: () => boolean;
    getPort: () => number;
    setPort: (port: number) => string;
    getNodeEnv: () => string;
    setNodeEnv: (_env: Environment) => string;
    getBabelEnv: () => string;
    setBabelEnv: (_env: Environment) => string;
    getLifecycle: () => string;
    isLifecycle: (cycle: Lifecycle) => boolean;
    isHTTPS: () => boolean;
    getWDSSocketHost: () => string | undefined;
    setWDSSocketHost: (host: string) => string;
    getWDSSocketPath: () => string | undefined;
    setWDSSocketPath: (path: string) => string;
    setWDSSocketPort: (port: number) => string;
    getWDSSocketPort: () => number;
    getWSSocket: () => Record<string, string | undefined>;
};
export default _default;
