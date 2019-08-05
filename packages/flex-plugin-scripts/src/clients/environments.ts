import { AuthConfig } from 'flex-dev-utils/dist/keytar';
import { isSidOfType, SidPrefix } from 'flex-dev-utils/dist/sids';

import BaseClient from './baseClient';
import { Environment, EnvironmentResource } from './serverless-types';
import ServiceClient from './services';
import paths from '../utils/paths';

export default class EnvironmentClient extends BaseClient {
  public static BaseUri = 'Environments';

  constructor(auth: AuthConfig, serviceSid: string) {
    super(auth, `${ServiceClient.getBaseUrl()}/Services/${serviceSid}`);

    if (!isSidOfType(serviceSid, 'ZS')) {
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
      .then((resource) => resource.environments.find((s) => s.unique_name === paths.packageName))
      .then((environment) => {
        if (!environment) {
          if (create) {
            return this.create();
          } else {
            throw new Error(`No environment with unique_name ${paths.packageName} was found`);
          }
        }

        return environment;
      });
  }

  /**
   * Creates an environment with the package name
   */
  public create = (): Promise<Environment> => {
    return this.http
      .post(EnvironmentClient.BaseUri, {
        UniqueName: paths.packageName,
        DomainSuffix: paths.packageName,
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
