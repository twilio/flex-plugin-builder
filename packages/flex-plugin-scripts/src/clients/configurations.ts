/* eslint-disable camelcase */
import { Credential } from '@twilio/flex-dev-utils';

import BaseClient from './baseClient';
import { Configuration, UIDependencies } from './configuration-types';

interface UpdateConfigurationPayload extends Partial<Configuration> {
  account_sid: string;
}

export default class ConfigurationClient extends BaseClient {
  public static BaseUrl = 'Configuration';

  private static version = 'v1';

  constructor(auth: Credential) {
    super(auth, ConfigurationClient.getBaseUrl(), { contentType: 'application/json' });
  }

  /**
   * Gets the base URL
   */
  public static getBaseUrl = (): string => {
    return BaseClient.getBaseUrl('flex-api', ConfigurationClient.version);
  };

  /**
   * Returns the {@link Configuration}
   */
  public get = async (): Promise<Configuration> => {
    return this.http.get<Configuration>(ConfigurationClient.BaseUrl);
  };

  /**
   * Updates the Config service
   *
   * @param payload the payload to update
   */
  public update = async (payload: UpdateConfigurationPayload): Promise<Configuration> => {
    return this.http.post<Configuration>(ConfigurationClient.BaseUrl, payload);
  };

  /**
   * Returns the registered Serverless Sids
   */
  public getServiceSids = async (): Promise<string[]> => {
    return this.get().then((resp) => resp.serverless_service_sids || []);
  };

  /**
   * Registers a new sid
   * @param serviceSid
   */
  public registerSid = async (serviceSid: string): Promise<Configuration> => {
    return this.get().then((config) => {
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
  };

  /**
   * Returns the Flex UI version stored on Configuration service
   */
  public getFlexUIVersion = async (): Promise<string> => {
    const config = await this.get();

    return config.ui_version;
  };

  /**
   * Returns the Flex UI dependencies stored on the Configuration service
   */
  public getUIDependencies = async (): Promise<UIDependencies> => {
    const config = await this.get();

    return config.ui_dependencies || {};
  };
}
