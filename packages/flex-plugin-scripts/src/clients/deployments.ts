import { AuthConfig } from 'flex-dev-utils/dist/keytar';
import { isSidOfType } from 'flex-dev-utils/dist/sids';

import BaseClient from './baseClient';
import { Deployment } from './serverless-types';
import ServiceClient from './services';

export default class EnvironmentClient extends BaseClient {
  constructor(auth: AuthConfig, serviceSid: string, environmentSid: string) {
    super(auth, `${ServiceClient.getBaseUrl()}/Services/${serviceSid}/Environments/${environmentSid}`);

    if (!isSidOfType(serviceSid, 'ZS')) {
      throw new Error(`ServiceSid ${serviceSid} is not valid`);
    }

    if (!isSidOfType(environmentSid, 'ZB')) {
      throw new Error(`EnvironmentSid ${environmentSid} is not valid`);
    }
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
