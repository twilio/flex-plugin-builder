type Null = null | undefined;

/**
 * Validates the string is a valid sid
 *
 * @param sid the sid
 */
export const isValidSid = (sid: string | Null) => sid && /^[A-Z]{2}[0-9a-f]{32}$/.test(sid);

/**
 * Validates sid is of type prefix provided
 *
 * @param sid     the sid
 * @param prefix  the prefix of the sid
 */
export const isSidOfType = (sid: string | Null, prefix: string | Null) => {
  return sid && prefix && isValidSid(sid) && prefix.toUpperCase() === sid.substr(0, 2);
};

/**
 * Prefix of Sids
 */
export const SidPrefix = {
  AccountSid: 'AC',
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
  SidPrefix,
};
