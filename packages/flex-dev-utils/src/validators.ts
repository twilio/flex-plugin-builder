import { isSidOfType, SidPrefix } from './sids';

const URL_REGEX = /^(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
const GITHUB_REGEX = /github\.com/;

/**
 * Simple input validator to verify it is not empty
 *
 * @param input the input to validate
 */
export const isInputNotEmpty = (input: string): boolean => Boolean(input && input.length > 0);

/**
 * Validates that the accountSid is valid
 *
 * @param str the accountSid
 */
export const validateAccountSid = (str: string): string | boolean => {
  if (!isInputNotEmpty(str)) {
    return false;
  }

  if (!isSidOfType(str, SidPrefix.AccountSid)) {
    return 'Invalid Account Sid was provided';
  }

  return true;
};

/**
 * Validates that the apiKey is valid
 *
 * @param str the apiKey
 */
export const validateApiKey = (str: string): string | boolean => {
  if (!isInputNotEmpty(str)) {
    return false;
  }

  if (!isSidOfType(str, SidPrefix.ApiKey)) {
    return 'Invalid Account Sid was provided';
  }

  return true;
};

/**
 * Validates the string is valid URL
 *
 * @param url {string}  the URL string to validate
 * @return whether the URL is valid
 * @private
 */
export const isValidUrl = (url: string): boolean => URL_REGEX.test(url);

/**
 * Validates the string is a GitHub URL
 *
 * @param url {string}  the URL string to validate
 * @return whether the URL is GitHub
 * @private
 */
export const isGitHubUrl = (url: string): boolean => GITHUB_REGEX.test(url);

/**
 * Validates that the URL is a GitHub URL
 *
 * @param url the URL to validate
 */
export const validateGitHubUrl = (url: string): string | boolean => {
  if (!isValidUrl(url)) {
    return 'Please enter a valid URL';
  }

  if (!isGitHubUrl(url)) {
    return 'Only GitHub URLs are currently supported';
  }

  return true;
};

export default {};
