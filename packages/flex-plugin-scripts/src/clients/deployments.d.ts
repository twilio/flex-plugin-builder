import { Credential } from 'flex-dev-utils';
import BaseClient from './baseClient';
import { Deployment } from './serverless-types';
export default class DeploymentClient extends BaseClient {
    static BaseUri: string;
    constructor(auth: Credential, serviceSid: string, environmentSid: string);
    /**
     * Creates a new deployment
     *
     * @param buildSid  the build sid
     */
    create: (buildSid: string) => Promise<Deployment>;
}
