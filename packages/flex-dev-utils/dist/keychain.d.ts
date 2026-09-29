export interface KeychainCredential {
    account: string;
    password: string;
}
export interface Keychain {
    deletePassword: (account: string) => Promise<boolean>;
    findCredentials: () => Promise<KeychainCredential[]>;
    setPassword: (account: string, password: string) => Promise<void>;
}
interface Keytar {
    deletePassword: (service: string, account: string) => Promise<boolean>;
    findCredentials: (service: string) => Promise<KeychainCredential[]>;
    setPassword: (service: string, account: string, password: string) => Promise<void>;
}
/**
 * Keytar is required optionally and so may not exist.
 * It will throw an error if a local installation is not found.
 */
export declare const _getKeytar: () => Keytar;
/**
 * main method that returns a keytar instance
 * @param service
 */
export default function keychain(service: string): Keychain;
export {};
