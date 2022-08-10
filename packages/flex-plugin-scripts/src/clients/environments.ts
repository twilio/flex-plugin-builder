/* eslint-disable camelcase */
import { PaginationMeta, TwilioCliError, urlJoin } from '@twilio/flex-dev-utils';
import { isSidOfType, SidPrefix } from '@twilio/flex-dev-utils/dist/sids';
import { randomString } from '@twilio/flex-dev-utils/dist/random';
import { getPaths } from '@twilio/flex-dev-utils/dist/fs';

import ServerlessClient from './serverless-client';

export interface ServerlessEnvironment {
  sid: string;
  account_sid: string;
  url: string;
  date_updated: string;
  date_created: string;
  unique_name: string;
  domain_suffix: string;
  domain_name: string;
  build_sid: string;
  service_sid: string;
}

const RESPONSE_KEY = 'environments';

interface ServerlessEnvironmentResourcePage extends PaginationMeta {
  [RESPONSE_KEY]: ServerlessEnvironment[];
}

export default class EnvironmentClient {
  public static DomainSuffixLength = 5;

  private readonly http: ServerlessClient;

  private readonly serviceSid: string;

  constructor(http: ServerlessClient, serviceSid: string) {
    if (!isSidOfType(serviceSid, SidPrefix.ServiceSid)) {
      throw new TwilioCliError(`${serviceSid} is not of type ${SidPrefix.ServiceSid}`);
    }

    this.http = http;
    this.serviceSid = serviceSid;
  }

  /**
   * Returns the {@link Environment} that has the same name as the packageName
   *
   * @param create    if set to true, will create an environment if not found
   */
  public get = async (create = true): Promise<ServerlessEnvironment> => {
    return this.list()
      .then((environments) => environments.find((s) => s.unique_name === getPaths().app.name))
      .then((environment) => {
        if (!environment) {
          if (create) {
            return this.create();
          }
          throw new Error(`No environment with unique_name ${getPaths().app.name} was found`);
        }

        return environment;
      });
  };

  /**
   * Creates an {@link ServerlessEnvironment} with the package name
   */
  public create = async (): Promise<ServerlessEnvironment> => {
    const environments = await this.list();
    const existingDomains = environments.map((environment) => environment.domain_suffix);
    const domainSuffix = randomString(EnvironmentClient.DomainSuffixLength, existingDomains);

    return this.http.post(urlJoin('Services', this.serviceSid, 'Environments'), {
      UniqueName: getPaths().app.name,
      DomainSuffix: domainSuffix,
    });
  };

  /**
   * Removes the {@link ServerlessEnvironment}
   */
  public remove = async (sid: string): Promise<void> => {
    if (!isSidOfType(sid, SidPrefix.EnvironmentSid)) {
      throw new Error(`${sid} is not of type ${SidPrefix.EnvironmentSid}`);
    }

    return this.http.delete(urlJoin('Services', this.serviceSid, 'Environments', sid));
  };

  /**
   * Fetches the list of {@link ServerlessEnvironment}
   */
  public list = async (): Promise<ServerlessEnvironment[]> => {
    return this.http
      .list<ServerlessEnvironmentResourcePage>(urlJoin('Services', this.serviceSid, 'Environments'), RESPONSE_KEY)
      .then((resp) => resp[RESPONSE_KEY]);
  };
}
