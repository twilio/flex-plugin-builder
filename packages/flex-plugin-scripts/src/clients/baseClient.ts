import { AuthConfig } from 'flex-dev-utils/dist/credentials';

import Http, { ContentType, HttpConfig } from './http';

export interface BaseClientOptions {
  contentType: ContentType;
}

export default abstract class BaseClient {
  /**
   * Returns the base URL
   */
  public static getBaseUrl = (subDomain: string, version: string): string => {
    const realms = BaseClient.realms;
    const realm = process.env.TWILIO_SERVERLESS_REALM;
    if (realm && !realms.includes(realm)) {
      throw new Error(`Invalid realm ${realm} was provided. Realm must be one of ${realms.join(',')}`);
    }

    const realmDomain = realm && realms.includes(realm) ? `.${realm.toLowerCase()}` : '';

    return `https://${subDomain}${realmDomain}.twilio.com/${version}`;
  }

  private static realms = ['dev', 'stage'];
  protected readonly config: HttpConfig;
  protected readonly http: Http;

  protected constructor(auth: AuthConfig, baseUrl: string, options?: BaseClientOptions) {
    const config: HttpConfig = {
      baseURL: baseUrl,
      auth,
      exitOnRejection: true,
    };
    if (options && options.contentType) {
      config.contentType = options.contentType;
    }

    this.config = config;
    this.http = new Http(this.config);
  }
}
