import { AuthConfig } from 'flex-dev-utils/dist/keytar';

import BaseClient from './baseClient';
import { Environment, EnvironmentResource } from './serverless-types';
import ServiceClient from './services';

export default class EnvironmentClient extends BaseClient {
  constructor(auth: AuthConfig, serviceSid: string) {
    super(auth, `${ServiceClient.getBaseUrl()}/Services/${serviceSid}`);
  }

  /**
   * Returns the {@link Environment} named default
   */
  public getDefault = (): Promise<Environment> => {
    return this.list()
      .then((resource) => resource.environments.find((s) => s.unique_name === 'default'))
      .then((environment) => {
        if (!environment) {
          throw new Error('No Environment named default was found.');
        }

        return environment;
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
