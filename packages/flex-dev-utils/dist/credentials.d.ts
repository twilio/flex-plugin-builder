import { Keychain, KeychainCredential } from './keychain';
export declare const SERVICE_NAME = "com.twilio.flex.plugins.builder";
export interface Credential {
    username: string;
    password: string;
}
/**
 * Instantiates a keychain to use
 */
export declare const _getKeychain: () => Keychain;
/**
 * Gets the credential service
 * @private
 */
export declare const _getService: () => Promise<KeychainCredential[]>;
/**
 * Finds the credential. If more than one credential exists, then it prompt the user to choose one.
 *
 * @param accountSid  optional accountSid to find
 * @private
 */
export declare const _findCredential: (accountSid?: string | undefined) => Promise<Credential | null>;
/**
 * Saves the credential
 *
 * @param username   the username
 * @param password  the password
 * @private
 */
export declare const _saveCredential: (username: string, password: string) => Promise<void>;
/**
 * Fetches the API Key/Secret and stores them in keychain.
 * If no credentials exists, then prompts the user to enter the credentials
 */
export declare const getCredential: () => Promise<Credential>;
/**
 * Clears the credentials
 */
export declare const clearCredentials: () => Promise<void>;
export default getCredential;
