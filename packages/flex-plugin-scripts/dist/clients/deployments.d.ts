import ServerlessClient from './serverless-client';
export interface ServerlessDeployment {
    sid: string;
    account_sid: string;
    url: string;
    date_updated: string;
    date_created: string;
    service_sid: string;
    environment_sid: string;
    build_sid: string;
}
export default class DeploymentClient {
    private readonly http;
    private readonly serviceSid;
    private readonly environmentSid;
    constructor(http: ServerlessClient, serviceSid: string, environmentSid: string);
    /**
     * Creates a new {@link ServerlessDeployment}
     *
     * @param buildSid  the build sid
     */
    create: (buildSid: string) => Promise<ServerlessDeployment>;
}
