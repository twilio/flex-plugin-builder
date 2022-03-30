/* eslint-disable import/no-unused-modules */

type Null = null | undefined;

const SID_REGEX = /^[A-Z]{2}[0-9A-Fa-c]{32}$/i;

/**
 * Validates the string is a valid sid
 *
 * @param sid the sid
 */
export const isValidSid = (sid: string | Null): boolean => Boolean(sid && /^[A-Z]{2}[0-9a-f]{32}$/.test(sid));

/**
 * Checks if the provided string is of type Sid
 * @param sid the sid to check
 */
export const looksLikeSid = (sid: string): boolean => {
  return Boolean(sid && SID_REGEX.test(sid));
};

/**
 * Validates sid is of type prefix provided
 *
 * @param sid     the sid
 * @param prefix  the prefix of the sid
 */
export const isSidOfType = (sid: string | Null, prefix: string | Null): boolean => {
  return Boolean(sid && prefix && isValidSid(sid) && prefix.toUpperCase() === sid.substr(0, 2));
};

/**
 * Prefix of Sids
 */
export const SidPrefix = {
  AccountSid: 'AC',
  ApiKey: 'SK',
  ServiceSid: 'ZS',
  EnvironmentSid: 'ZE',
  BuildSid: 'ZB',
  FileSid: 'ZH',
  VersionSid: 'ZN',
  DeploymentSid: 'ZD',
};

export default {
  isValidSid,
  isSidOfType,
  looksLikeSid,
  SidPrefix,
};
