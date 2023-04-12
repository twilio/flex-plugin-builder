import get from 'lodash.get';
import { TwilioError } from '@twilio/flex-plugins-utils-exception';

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

export type Region = 'dev' | 'stage';

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

/* c8 ignore next */
export const isNode = (): boolean => typeof process === 'object' && `${process}` === '[object process]';

/* c8 ignore next */
export const isWin32 = (): boolean => isNode() && process.platform === 'win32';

/**
 * Internal method for setting process.env
 * This is used to bypass terser library that does `process.env.FOO` string replacement
 * @param key the key to set
 * @param value the value set it to
 */
export const setProcessEnv = <T>(key: string, value: T): void => {
  if (isNode()) {
    process.env[key] = value as unknown as string;
  }
};

/**
 * Internal method for getting the process.env
 * @param key the key to get
 */
export const getProcessEnv = <T>(key: string): T => process.env[key] as unknown as T;

/**
 * Helper method to test whether env variable is defined
 * @param key the env to lookup
 * @return whether the key is set
 */
const isDefined = (key: string | undefined) => typeof key === 'string' && key !== '';

const setValidJSFile = (source: string) => {
  if (!source.endsWith('.js')) {
    throw new TwilioError(`${source} is not a valid JS file.`);
  }
  setProcessEnv('FLEX_UI_SRC', source);
};

/* c8 ignore next */
export const hasHttpProxy = (): boolean => isNode() && isDefined(getProcessEnv('HTTP_PROXY'));
export const getHttpProxy = (): string => getProcessEnv('HTTP_PROXY');
export const setHttpProxy = (host: string): void => setProcessEnv('HTTP_PROXY', host);
export const skipPreflightCheck = (): boolean => getProcessEnv('SKIP_PREFLIGHT_CHECK') === 'true';
export const getAccountSid = (): string | undefined => getProcessEnv('TWILIO_ACCOUNT_SID');
export const getAuthToken = (): string | undefined => getProcessEnv('TWILIO_AUTH_TOKEN');
export const hasHost = (): boolean => isDefined(getProcessEnv('HOST'));
export const getHost = (): string | undefined => getProcessEnv('HOST');
export const setHost = (host: string): void => setProcessEnv('HOST', host);
export const hasPort = (): boolean => isDefined(getProcessEnv('PORT'));
export const getPort = (): number => Number(getProcessEnv('PORT'));
export const setPort = (port: number): void => setProcessEnv('PORT', String(port));
export const getFlexUISrc = (): string | undefined => getProcessEnv('FLEX_UI_SRC');
export const setFlexUISrc = (source: string): void => setValidJSFile(source.toString());
export const getNodeEnv = (): string => getProcessEnv('NODE_ENV');
export const setNodeEnv = (_env: Environment): void => setProcessEnv('NODE_ENV', _env);
export const getBabelEnv = (): string => getProcessEnv('BABEL_ENV');
export const setBabelEnv = (_env: Environment): void => setProcessEnv('BABEL_ENV', _env);
export const getLifecycle = (): string => getProcessEnv('npm_lifecycle_event');
export const isLifecycle = (cycle: Lifecycle): boolean => getProcessEnv('npm_lifecycle_event') === cycle;
export const isHTTPS = (): boolean => getProcessEnv('HTTPS') === 'true';
export const setWDSSocketHost = (host: string): void => setProcessEnv('WDS_SOCKET_HOST', host);
export const getWDSSocketHost = (): string | undefined => getProcessEnv('WDS_SOCKET_HOST');
export const setWDSSocketPath = (path: string): void => setProcessEnv('WDS_SOCKET_PATH', path);
export const getWDSSocketPath = (): string | undefined => getProcessEnv('WDS_SOCKET_PATH');
export const setWDSSocketPort = (port: number): void => setProcessEnv('WDS_SOCKET_PORT', port.toString());
export const getWDSSocketPort = (): number => Number(getProcessEnv('WDS_SOCKET_PORT'));
export const getWSSocket = (): Record<string, string | undefined> => ({
  host: getProcessEnv('WDS_SOCKET_HOST'),
  path: getProcessEnv('WDS_SOCKET_PATH'),
  port: getProcessEnv('WDS_SOCKET_PORT'),
});

/* c8 ignore next */
export const isCI = (): boolean => isNode() && getProcessEnv('CI') === 'true';

/**
 * Sets the Twilio Profile
 * @param profile the profile to set
 */
export const setTwilioProfile = (profile: string): void => setProcessEnv('TWILIO_PROFILE', profile);

/**
 * Returns the Twilio Profile
 */
export const getTwilioProfile = (): string | undefined => getProcessEnv('TWILIO_PROFILE');

/**
 * Sets the environment to persist the terminal
 */
export const persistTerminal = (): void => setProcessEnv('PERSIST_TERMINAL', 'true');

/**
 * Determines if the terminal should be persisted or not
 */
export const isTerminalPersisted = (): boolean => isNode() && getProcessEnv('PERSIST_TERMINAL') === 'true';

/**
 * Determines whether script should run in quiet mode
 */
export const isQuiet = (): boolean => isNode() && getProcessEnv('QUIET') === 'true';

/**
 * Sets the quiet mode
 */
export const setQuiet = (isQuiet: boolean = true): void => setProcessEnv('QUIET', String(isQuiet));

/**
 * Returns true if the caller is the CLI
 */
export const isCLI = (): boolean => getProcessEnv('FLEX_PLUGINS_CLI') === 'true';

/**
 * Sets the caller to be the CLI
 */
export const setCLI = (): void => setProcessEnv('FLEX_PLUGINS_CLI', 'true');

/**
 * Determines if log level should be trace level
 */
export const isTrace = (): boolean => {
  if (isNode()) {
    return getProcessEnv('TRACE') === 'true';
  }

  if (window.Twilio) {
    return window.Twilio.Flex.Manager.getInstance().configuration.logLevel === 'trace';
  }

  return false;
};

/**
 * Sets the debug mode
 */
export const setDebug = (isDebug: boolean = true): void => setProcessEnv('DEBUG', String(isDebug));

/**
 * Returns true if running in debug verbose mode
 */
export const isDebug = (): boolean => {
  if (isTrace()) {
    return true;
  }
  if (isNode()) {
    return getProcessEnv('DEBUG') === 'true';
  }

  if (window.Twilio) {
    return window.Twilio.Flex.Manager.getInstance().configuration.logLevel === 'debug';
  }

  return false;
};

/**
 * Sets the region
 */
export const setRegion = (region: Region): void => setProcessEnv('TWILIO_REGION', region);

/**
 * Returns the region
 */
/* c8 ignore next */
export const getRegion = (): Region | string => {
  if (isNode()) {
    return getProcessEnv('TWILIO_REGION') as Region;
  }

  if (window.Twilio) {
    const region = get(window.Twilio.Flex.Manager.getInstance(), 'configuration.sdkOptions.chat.region');
    if (region && region.indexOf('stage') !== -1) {
      return 'stage';
    }
    if (region && region.indexOf('dev') !== -1) {
      return 'dev';
    }

    return '';
  }

  const { href } = window.location;
  if (href && href.indexOf('flex.stage.twilio') !== -1) {
    return 'stage';
  }
  if (href && href.indexOf('flex.dev.twilio') !== -1) {
    return 'dev';
  }

  return '';
};

export default {
  setProcessEnv,
  getProcessEnv,
  isNode,
  isWin32,
  persistTerminal,
  hasHttpProxy,
  getHttpProxy,
  skipPreflightCheck,
  isTerminalPersisted,
  setTwilioProfile,
  getTwilioProfile,
  isQuiet,
  setQuiet,
  isCLI,
  setCLI,
  isCI,
  setDebug,
  isDebug,
  isTrace,
  getAccountSid,
  getAuthToken,
  getRegion,
  setRegion,
  hasHost,
  getHost,
  setHost,
  hasPort,
  getPort,
  setPort,
  getFlexUISrc,
  setFlexUISrc,
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
