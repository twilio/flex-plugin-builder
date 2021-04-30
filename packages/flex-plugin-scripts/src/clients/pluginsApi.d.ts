import { Credential } from 'flex-dev-utils';
import BaseClient from './baseClient';
export default class PluginsApiClient extends BaseClient {
    static BaseUri: string;
    constructor(auth: Credential);
    static getBaseUrl: () => string;
    /**
     * Checks whether the beta feature flag has been turned on for this account
     */
    hasFlag: () => Promise<boolean>;
}
