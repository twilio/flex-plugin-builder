import { AuthConfig } from 'flex-dev-utils/dist/credentials';
import BaseClient from './baseClient';

export default class PluginsApiClient extends BaseClient {
  public static BaseUri = 'Builds';

  public static getBaseUrl = () => {
    return `${BaseClient.getBaseUrl('flex-api', 'v1')}/PluginService`;
  }

  constructor(auth: AuthConfig) {
    super(auth, PluginsApiClient.getBaseUrl());
  }

  /**
   * Checks whether the beta feature flag has been turned on for this account
   */
  public hasFlag = (): Promise<boolean> => {
    return this.http
      .get('/Plugins')
      .then(() => true)
      .catch(() => false);
  }
}
