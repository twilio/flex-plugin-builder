import { AuthConfig } from 'flex-dev-utils/dist/keytar';

import BaseClient from './baseClient';
import { Environment, EnvironmentResource } from './serverless-types';
import ServiceClient from './services';
import paths from '../utils/paths';

export default class EnvironmentClient extends BaseClient {
  constructor(auth: AuthConfig, serviceSid: string) {
    super(auth, `${ServiceClient.getBaseUrl()}/Services/${serviceSid}`);
  }

  /**
   * Returns the {@link Environment} that has the same name as the packageName
   */
  public get = (): Promise<Environment> => {
    return this.list()
      .then((resource) => resource.environments.find((s) => s.unique_name === paths.packageName))
      .then((environment) => {
        if (!environment) {
          return this.create();
        }

        return environment;
      });
  }

  /**
   * Creates an environment with the package name
   */
  public create = (): Promise<Environment> => {
    return this.http
      .post('Environments', {
        UniqueName: paths.packageName,
      });
  }

  /**
   * Fetches a list of {@link Environment}
   */
  public list = (): Promise<EnvironmentResource> => {
    return this.http
      .get<EnvironmentResource>('Environments');
  }
}
