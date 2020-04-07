const env = process.env;

export type Environment = 'production' | 'development';

const isDefined = (key: string | undefined) => typeof key === 'string' && key !== '';

export const isTerminalPersisted = () => env.PERSIST_TERMINAL === 'true';
export const isCI = () => env.CI === 'true';
export const isDebug = () => env.DEBUG === 'true';
export const isVerbose = () => env.TRACE === 'true';
export const getAccountSid = () => env.TWILIO_ACCOUNT_SID;
export const getAuthToken = () => env.TWILIO_AUTH_TOKEN;
export const getRealm = () => env.REALM;
export const hasHost = () => isDefined(env.HOST);
export const getHost = () => env.HOST;
export const setHost = (host: string) => env.HOST = host;
export const hasPort = () => isDefined(env.PORT);
export const getPort = () => Number(env.PORT);
export const setPort = (port: number) => env.PORT = String(port);
export const getNodeEnv = () => env.NODE_ENV;
export const setNodeEnv = (_env: Environment) => env.NODE_ENV = _env;
export const getBabelEnv = () => env.BABEL_ENV;
export const setBabelEnv = (_env: Environment) => env.BABEL_ENV = _env;

export default {
  isTerminalPersisted,
isCI,
isDebug,
isVerbose,
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
};
