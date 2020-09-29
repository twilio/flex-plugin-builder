import { ConfigurationContext, ConfigurationInstance } from 'twilio/lib/rest/flexApi/v1/configuration';

/**
 * Wrapper Twilio Flex Configuration Public API
 */
export default class FlexConfigurationClient {
  private client;

  constructor(client: ConfigurationContext) {
    this.client = client;
  }

  /**
   * Fetches the {@link ConfigurationInstance}
   */
  public async fetch(): Promise<ConfigurationInstance> {
    return this.client.fetch();
  }

  /**
   * Fetches the Serverless ServiceSid
   */
  public async getServerlessSid(): Promise<string | null> {
    const config = await this.fetch();
    if (!config.serverlessServiceSids) {
      return null;
    }

    return config.serverlessServiceSids[0];
  }
}
