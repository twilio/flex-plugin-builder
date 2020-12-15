/* eslint-disable import/no-unused-modules */
export enum Environment {
  Production = 'production',
  Development = 'development',
  Test = 'test',
}

export enum Lifecycle {
  Test = 'test',
  Build = 'build',
  Prebuild = 'prebuild',
  Deploy = 'deploy',
  Predeploy = 'predeploy',
}

/**
 * Helper method to test whether env variable is defined
 * @param key the env to lookup
 * @return whether the key is set
 */
const isDefined = (key: string | undefined) => typeof key === 'string' && key !== '';

/* istanbul ignore next */
export const isWin32 = (): boolean => process.platform === 'win32';
export const persistTerminal = (): string => (process.env.PERSIST_TERMINAL = 'true');
export const skipPreflightCheck = (): boolean => process.env.SKIP_PREFLIGHT_CHECK === 'true';
export const isTerminalPersisted = (): boolean => process.env.PERSIST_TERMINAL === 'true';
export const allowUnbundledReact = (): boolean => process.env.UNBUNDLED_REACT === 'true';
export const setQuiet = (): string => (process.env.QUIET = 'true');
export const isCI = (): boolean => process.env.CI === 'true';
export const isTrace = (): boolean => process.env.TRACE === 'true';
export const isDebug = (): boolean => process.env.DEBUG === 'true' || isTrace();
export const getAccountSid = (): string | undefined => process.env.TWILIO_ACCOUNT_SID;
export const getAuthToken = (): string | undefined => process.env.TWILIO_AUTH_TOKEN;
export const getRealm = (): string | undefined => process.env.REALM;
export const hasHost = (): boolean => isDefined(process.env.HOST);
export const getHost = (): string | undefined => process.env.HOST;
export const setHost = (host: string): string => (process.env.HOST = host);
export const hasPort = (): boolean => isDefined(process.env.PORT);
export const getPort = (): number => Number(process.env.PORT);
export const setPort = (port: number): string => (process.env.PORT = String(port));
export const getNodeEnv = (): string => process.env.NODE_ENV as string;
export const setNodeEnv = (_env: Environment): string => (process.env.NODE_ENV = _env);
export const getBabelEnv = (): string => process.env.BABEL_ENV as string;
export const setBabelEnv = (_env: Environment): string => (process.env.BABEL_ENV = _env);
export const getLifecycle = (): string => process.env.npm_lifecycle_event as string;
export const isLifecycle = (cycle: Lifecycle): boolean => process.env.npm_lifecycle_event === cycle;
export const isHTTPS = (): boolean => process.env.HTTPS === 'true';
export const setWDSSocketHost = (host: string): string => (process.env.WDS_SOCKET_HOST = host);
export const getWDSSocketHost = (): string | undefined => process.env.WDS_SOCKET_HOST;
export const setWDSSocketPath = (path: string): string => (process.env.WDS_SOCKET_PATH = path);
export const getWDSSocketPath = (): string | undefined => process.env.WDS_SOCKET_PATH;
export const setWDSSocketPort = (port: number): string => (process.env.WDS_SOCKET_PORT = port.toString());
export const getWDSSocketPort = (): number => Number(process.env.WDS_SOCKET_PORT);
export const getWSSocket = (): Record<string, string | undefined> => ({
  host: process.env.WDS_SOCKET_HOST,
  path: process.env.WDS_SOCKET_PATH,
  port: process.env.WDS_SOCKET_PORT,
});

export default {
  isWin32,
  persistTerminal,
  skipPreflightCheck,
  allowUnbundledReact,
  isTerminalPersisted,
  setQuiet,
  isCI,
  isDebug,
  isTrace,
  getAccountSid,
  getAuthToken,
  getRealm,
  hasHost,
  getHost,
  setHost,
  hasPort,
  getPort,
  setPort,
  getNodeEnv,
  setNodeEnv,
  getBabelEnv,
  setBabelEnv,
  getLifecycle,
  isLifecycle,
  isHTTPS,
  getWDSSocketHost,
  setWDSSocketHost,
  getWDSSocketPath,
  setWDSSocketPath,
  setWDSSocketPort,
  getWDSSocketPort,
  getWSSocket,
};
