import { paths } from 'flex-dev-utils';
import { AuthConfig } from 'flex-dev-utils/dist/credentials';
import { isSidOfType, SidPrefix } from 'flex-dev-utils/dist/sids';
import { randomString } from 'flex-dev-utils/dist/random';

import BaseClient from './baseClient';
import { Environment, EnvironmentResource } from './serverless-types';
import ServiceClient from './services';

export default class EnvironmentClient extends BaseClient {
  public static BaseUri = 'Environments';
  public static DomainSuffixLength = 5;

  constructor(auth: AuthConfig, serviceSid: string) {
    super(auth, `${ServiceClient.getBaseUrl()}/Services/${serviceSid}`);

    if (!isSidOfType(serviceSid, SidPrefix.ServiceSid)) {
      throw new Error(`ServiceSid ${serviceSid} is not valid`);
    }
  }

  /**
   * Returns the {@link Environment} that has the same name as the packageName
   *
   * @param create  if set to true, will create an environment if not found
   */
  public get = (create = true): Promise<Environment> => {
    return this.list()
      .then((resource) => resource.environments.find((s) => s.unique_name === paths().app.name))
      .then((environment) => {
        if (!environment) {
          if (create) {
            return this.create();
          } else {
            throw new Error(`No environment with unique_name ${paths().app.name} was found`);
          }
        }

        return environment;
      });
  }

  /**
   * Creates an environment with the package name
   */
  public create = (): Promise<Environment> => {
    return this.list()
      .then((resource) => resource.environments)
      .then((environments) => {
        const list = environments.map((environment) => environment.domain_suffix);

        return randomString(EnvironmentClient.DomainSuffixLength, list);
      })
      .then((domainSuffix) => {
        return this.http
          .post(EnvironmentClient.BaseUri, {
            UniqueName: paths().app.name,
            DomainSuffix: domainSuffix,
          });
      });
  }

  /**
   * Removes the Environment
   */
  public remove = (sid: string): Promise<void> => {
    if (!isSidOfType(sid, SidPrefix.EnvironmentSid)) {
      throw new Error(`${sid} is not of type ${SidPrefix.EnvironmentSid}`);
    }

    return this.http
      .delete(`${EnvironmentClient.BaseUri}/${sid}`);
  }

  /**
   * Fetches a list of {@link Environment}
   */
  public list = (): Promise<EnvironmentResource> => {
    return this.http
      .get<EnvironmentResource>(EnvironmentClient.BaseUri);
  }
}
