/**
 * Simple input validator to verify it is not empty
 *
 * @param input the input to validate
 */
export declare const isInputNotEmpty: (input: string) => boolean;
/**
 * Validates that the accountSid is valid
 *
 * @param str the accountSid
 */
export declare const validateAccountSid: (str: string) => string | boolean;
/**
 * Validates that the apiKey is valid
 *
 * @param str the apiKey
 */
export declare const validateApiKey: (str: string) => string | boolean;
/**
 * Validates the string is valid URL
 *
 * @param url {string}  the URL string to validate
 * @return whether the URL is valid
 * @private
 */
export declare const isValidUrl: (url: string) => boolean;
/**
 * Validates the string is a GitHub URL
 *
 * @param url {string}  the URL string to validate
 * @return whether the URL is GitHub
 * @private
 */
export declare const isGitHubUrl: (url: string) => boolean;
/**
 * Validates that the URL is a GitHub URL
 *
 * @param url the URL to validate
 */
export declare const validateGitHubUrl: (url: string) => string | boolean;
declare const _default: {};
export default _default;
