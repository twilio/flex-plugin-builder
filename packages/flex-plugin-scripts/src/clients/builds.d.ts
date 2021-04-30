import { Credential } from 'flex-dev-utils';
import BaseClient from './baseClient';
import { Build } from './serverless-types';
export interface BuildData {
    FunctionVersions: string[];
    AssetVersions: string[];
    Dependencies: object;
}
export default class BuildClient extends BaseClient {
    static BaseUri: string;
    private static timeoutMsec;
    private static pollingIntervalMsec;
    constructor(auth: Credential, serviceSid: string);
    /**
     * Creates a new {@link Build} and then polls the endpoint once a second until the build is
     * complete.
     *
     * @param data  the build data
     */
    create: (data: BuildData) => Promise<Build>;
    /**
     * Fetches a build by buildSid
     *
     * @param sid  the build sid to fetch
     */
    get: (sid: string) => Promise<Build>;
    /**
     * Creates a new instance of build
     *
     * @param data  the build data
     * @private
     */
    private _create;
}
