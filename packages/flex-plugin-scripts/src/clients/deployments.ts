/* eslint-disable camelcase */
import { TwilioCliError, urlJoin } from '@twilio/flex-dev-utils';
import { isSidOfType, SidPrefix } from '@twilio/flex-dev-utils/dist/sids';

import ServerlessClient from './serverless-client';

// eslint-disable-next-line import/no-unused-modules
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
  private readonly http: ServerlessClient;

  private readonly serviceSid: string;

  private readonly environmentSid: string;

  constructor(http: ServerlessClient, serviceSid: string, environmentSid: string) {
    if (!isSidOfType(serviceSid, SidPrefix.ServiceSid)) {
      throw new TwilioCliError(`${serviceSid} is not of type ${SidPrefix.ServiceSid}`);
    }

    if (!isSidOfType(environmentSid, SidPrefix.EnvironmentSid)) {
      throw new TwilioCliError(`${environmentSid} is not of type ${SidPrefix.EnvironmentSid}`);
    }

    this.http = http;
    this.serviceSid = serviceSid;
    this.environmentSid = environmentSid;
  }

  /**
   * Creates a new {@link ServerlessDeployment}
   *
   * @param buildSid  the build sid
   */
  public create = async (buildSid: string): Promise<ServerlessDeployment> => {
    if (!isSidOfType(buildSid, SidPrefix.BuildSid)) {
      throw new TwilioCliError(`${buildSid} is not of type ${SidPrefix.BuildSid}`);
    }

    return this.http.post<ServerlessDeployment>(
      urlJoin('Services', this.serviceSid, 'Environments', this.environmentSid, 'Deployments'),
      { BuildSid: buildSid },
    );
  };
}
