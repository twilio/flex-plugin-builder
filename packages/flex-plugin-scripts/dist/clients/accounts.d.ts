export interface Account {
    auth_token?: string;
    friendly_name?: string;
    sid: string;
}
export default class AccountClient {
    static version: string;
    private readonly http;
    constructor(username: string, password: string);
    /**
     * Returns the Account object
     *
     * @param sid the account sid to lookup
     */
    get: (sid: string) => Promise<Account>;
}
