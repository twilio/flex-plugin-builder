import ServerlessClient from './serverless-client';
import { AssetVersion, FunctionVersion } from './assets';
export declare enum BuildStatus {
    Building = "building",
    Completed = "completed",
    Failed = "failed"
}
export interface ServerlessBuild {
    sid: string;
    account_sid: string;
    url: string;
    date_updated: string;
    date_created: string;
    status: BuildStatus;
    asset_versions: AssetVersion[];
    function_versions: FunctionVersion[];
    dependencies: object;
    service_sid: string;
}
export interface BuildData {
    FunctionVersions: string[];
    AssetVersions: string[];
    Dependencies: object;
    Runtime?: string;
}
export default class BuildClient {
    private static NodeEngine;
    private static timeoutMsec;
    private static pollingIntervalMsec;
    private readonly client;
    private readonly serviceSid;
    constructor(client: ServerlessClient, serviceSid: string);
    /**
     * Creates a new {@link Build} and then polls the endpoint once a second until the build is
     * complete.
     *
     * @param data  the build data
     */
    create: (data: BuildData) => Promise<ServerlessBuild>;
    /**
     * Fetches a build by buildSid
     *
     * @param sid  the build sid to fetch
     */
    get: (sid: string) => Promise<ServerlessBuild>;
    /**
     * Creates a new instance of build
     *
     * @param data  the {@link BuildData}
     * @private
     */
    private _create;
}
