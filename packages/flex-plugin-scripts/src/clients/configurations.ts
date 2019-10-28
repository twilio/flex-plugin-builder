import { AuthConfig } from 'flex-dev-utils/dist/credentials';

import BaseClient from './baseClient';
import { Configuration } from './configuration-types';

export default class ConfigurationClient extends BaseClient {
  public static BaseUrl = 'Configuration';

  /**
   * Gets the base URL
   */
  public static getBaseUrl = (): string => {
    return BaseClient.getBaseUrl('flex-api', ConfigurationClient.version);
  }

  private static version = 'v1';

  constructor(auth: AuthConfig) {
    super(auth, ConfigurationClient.getBaseUrl(), { contentType: 'application/json' });
  }

  /**
   * Returns the {@link Configuration}
   */
  public get = (): Promise<Configuration> => {
    return this.http
      .get<Configuration>(ConfigurationClient.BaseUrl);
  }

  /**
   * Updates the Config service
   *
   * @param payload the payload to update
   */
  public update = (payload: object): Promise<Configuration> => {
    return this.http
      .post<Configuration>(ConfigurationClient.BaseUrl, payload);
  }

  /**
   * Returns the registered Serverless Sids
   */
  public getServiceSids = (): Promise<string[]> => {
    return this.get()
      .then((resp) => resp.serverless_service_sids || []);
  }

  /**
   * Registers a new sid
   * @param serviceSid
   */
  public registerSid = (serviceSid: string): Promise<Configuration> => {
    return this.get()
      .then((config) => {
        const serviceSids = config.serverless_service_sids || [];
        if (serviceSids.includes(serviceSid)) {
          return config;
        }
        serviceSids.push(serviceSid);

        const payload = {
          account_sid: config.account_sid,
          serverless_service_sids: serviceSids,
        };

        return this.update(payload);
      });
  }
}
