/// <reference path="../module.d.ts" />
import get from 'lodash.get';
import { TwilioError } from 'flex-plugins-utils-exception';

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
  process.env.FLEX_UI_SRC = source;
};

/* istanbul ignore next */
export const skipPreflightCheck = (): boolean => process.env.SKIP_PREFLIGHT_CHECK === 'true';
export const allowUnbundledReact = (): boolean => process.env.UNBUNDLED_REACT === 'true';
export const getAccountSid = (): string | undefined => process.env.TWILIO_ACCOUNT_SID;
export const getAuthToken = (): string | undefined => process.env.TWILIO_AUTH_TOKEN;
export const hasHost = (): boolean => isDefined(process.env.HOST);
export const getHost = (): string | undefined => process.env.HOST;
export const setHost = (host: string): string => (process.env.HOST = host);
export const hasPort = (): boolean => isDefined(process.env.PORT);
export const getPort = (): number => Number(process.env.PORT);
export const setPort = (port: number): string => (process.env.PORT = String(port));
export const getFlexUISrc = (): string | undefined => process.env.FLEX_UI_SRC;
export const setFlexUISrc = (source: string): void => setValidJSFile(source.toString());
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

/* istanbul ignore next */
export const isNode = (): boolean => typeof process === 'object' && `${process}` === '[object process]';

/* istanbul ignore next */
export const isWin32 = (): boolean => isNode() && process.platform === 'win32';

/* istanbul ignore next */
export const isCI = (): boolean => isNode() && process.env.CI === 'true';

/**
 * Sets the Twilio Profile
 * @param profile the profile to set
 */
export const setTwilioProfile = (profile: string): void => {
  if (isNode()) {
    process.env.TWILIO_PROFILE = profile;
  }
};

/**
 * Returns the Twilio Profile
 */
export const getTwilioProfile = (): string | undefined => process.env.TWILIO_PROFILE;

/**
 * Sets the environment to persist the terminal
 */
export const persistTerminal = (): void => {
  if (isNode()) {
    process.env.PERSIST_TERMINAL = 'true';
  }
};

/**
 * Determines if the terminal should be persisted or not
 */
export const isTerminalPersisted = (): boolean => isNode() && process.env.PERSIST_TERMINAL === 'true';

/**
 * Determines whether script should run in quiet mode
 */
export const isQuiet = (): boolean => isNode() && process.env.QUIET === 'true';

/**
 * Sets the quiet mode
 */
export const setQuiet = (isQuiet: boolean = true): void => {
  process.env.QUIET = String(isQuiet);
};

/**
 * Returns true if the caller is the CLI
 */
export const isCLI = (): boolean => process.env.FLEX_PLUGINS_CLI === 'true';

/**
 * Sets the caller to be the CLI
 */
export const setCLI = (): void => {
  process.env.FLEX_PLUGINS_CLI = 'true';
};

/**
 * Determines if log level should be trace level
 */
export const isTrace = (): boolean => {
  if (isNode()) {
    return process.env.TRACE === 'true';
  }

  if (window.Twilio) {
    return window.Twilio.Flex.Manager.getInstance().configuration.logLevel === 'trace';
  }

  return false;
};

/**
 * Sets the debug mode
 */
export const setDebug = (isDebug: boolean = true): void => {
  if (isNode()) {
    process.env.DEBUG = String(isDebug);
  }
};

/**
 * Returns true if running in debug verbose mode
 */
export const isDebug = (): boolean => {
  if (isTrace()) {
    return true;
  }
  if (isNode()) {
    return process.env.DEBUG === 'true';
  }

  if (window.Twilio) {
    return window.Twilio.Flex.Manager.getInstance().configuration.logLevel === 'debug';
  }

  return false;
};

/**
 * Sets the region
 */
export const setRegion = (region: Region): void => {
  process.env.TWILIO_REGION = region;
};

/**
 * Returns the region
 */
/* istanbul ignore next */
export const getRegion = (): Region | string => {
  if (isNode()) {
    return process.env.TWILIO_REGION as Region;
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
  isNode,
  isWin32,
  persistTerminal,
  skipPreflightCheck,
  allowUnbundledReact,
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
