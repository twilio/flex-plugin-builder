const SID_REGEX = /^[A-Z]{2}[0-9A-Fa-c]{32}$/i;

/**
 * Checks if the provided string is of type Sid
 * @param sid the sid to check
 */
export const looksLikeSid = (sid: string): boolean => {
  return Boolean(sid && SID_REGEX.test(sid));
};
