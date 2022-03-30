import { ConfigurationContext, ConfigurationInstance } from 'twilio/lib/rest/flexApi/v1/configuration';
import { TwilioCliError } from '@twilio/flex-dev-utils';
import { HttpsProxyAgent } from 'https-proxy-agent';
import phin from 'phin';

export interface FlexConfigurationClientOptions {
  accountSid: string;
  username: string;
  password: string;
  region?: 'dev' | 'stage';
}

/**
 * Wrapper Twilio Flex Configuration Public API
 */
export default class FlexConfigurationClient {
  private client: ConfigurationContext;

  private options: FlexConfigurationClientOptions;

  constructor(client: ConfigurationContext, options: FlexConfigurationClientOptions) {
    this.client = client;
    this.options = options;
  }

  /**
   * Fetches the {@link ConfigurationInstance}
   */
  public async fetch(): Promise<ConfigurationInstance> {
    const config = await this.client.fetch();
    if (!config.serverlessServiceSids) {
      config.serverlessServiceSids = [];
    }

    return config;
  }

  /**
   * Fetches the Serverless ServiceSid
   */
  public async getServerlessSid(): Promise<string | null> {
    const config = await this.fetch();

    return config.serverlessServiceSids[0];
  }

  /**
   * Registers Serverless sid
   * @param serviceSid the sid to register
   */
  public async registerServerlessSid(serviceSid: string): Promise<ConfigurationInstance> {
    const config = await this.fetch();
    if (config.serverlessServiceSids.includes(serviceSid)) {
      return config;
    }

    config.serverlessServiceSids.push(serviceSid);
    await this.updateServerlessSids(config.serverlessServiceSids);

    return this.fetch();
  }

  /**
   * Removes a Serverless sid
   * @param serviceSid the sid to remove
   */
  public async unregisterServerlessSid(serviceSid: string): Promise<ConfigurationInstance> {
    const config = await this.fetch();
    const index = config.serverlessServiceSids.indexOf(serviceSid);
    if (index === -1) {
      return config;
    }

    config.serverlessServiceSids.splice(index, 1);
    await this.updateServerlessSids(config.serverlessServiceSids);

    return this.fetch();
  }

  /**
   * Updates the serverless sids
   * @param sids  the serverless sid to update
   * @private
   */
  private async updateServerlessSids(sids: string[]): Promise<void> {
    const auth = Buffer.from(`${this.options.username}:${this.options.password}`, 'utf8').toString('base64');
    // eslint-disable-next-line camelcase
    const data = { account_sid: this.options.accountSid, serverless_service_sids: sids };
    const url = this.options.region
      ? `https://flex-api.${this.options.region}.twilio.com/v1/Configuration`
      : 'https://flex-api.twilio.com/v1/Configuration';

    // use proxy
    const agent = process.env.HTTP_PROXY ? new HttpsProxyAgent(process.env.HTTP_PROXY) : undefined;

    const response = await phin({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      parse: 'json',
      data,
      core: {
        agent,
      },
    });
    if (response.statusCode !== 200) {
      throw new TwilioCliError(response.body as string);
    }
  }
}
