import { AuthConfig } from './auth';
import BaseClient from './baseClient';
import { Deployment } from './serverless-types';
import ServiceClient from './services';

export default class EnvironmentClient extends BaseClient {
  constructor(auth: AuthConfig, serviceSid: string, environmentSid: string) {
    super(auth, `${ServiceClient.getBaseUrl()}/Services/${serviceSid}/Environments/${environmentSid}`);
  }

  /**
   * Creates a new deployment
   *
   * @param buildSid  the build sid
   */
  public create = (buildSid: string): Promise<Deployment> => {
    return this.http
      .post<Deployment>('Deployments', {BuildSid: buildSid});
  }
}
