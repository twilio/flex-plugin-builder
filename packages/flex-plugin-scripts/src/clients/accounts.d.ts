import { Credential } from 'flex-dev-utils';
import BaseClient from './baseClient';
export interface Account {
    auth_token?: string;
    friendly_name?: string;
    sid: string;
}
export default class AccountClient extends BaseClient {
    static BaseUrl: string;
    static version: string;
    constructor(auth: Credential);
    /**
     * Gets the base URL
     */
    static getBaseUrl: () => string;
    /**
     * Returns the Account object
     *
     * @param sid the account sid to lookup
     */
    get: (sid: string) => Promise<Account>;
}
