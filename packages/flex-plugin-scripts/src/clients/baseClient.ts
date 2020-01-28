import { AuthConfig } from 'flex-dev-utils/dist/credentials';

import Http, { ContentType, HttpConfig } from './http';
import { FLEX_PACKAGES } from '../scripts/info';
import { getPackageDetails, PackageDetail } from '../utils/package';
import { logger } from 'flex-dev-utils';

export interface BaseClientOptions {
  contentType: ContentType;
}

export default abstract class BaseClient {
  public static userAgent = BaseClient.getUserAgent();
  /**
   * Returns the base URL
   */
  public static getBaseUrl = (subDomain: string, version: string): string => {
    const realms = BaseClient.realms;
    const realm = process.env.REALM;
    if (realm && !realms.includes(realm)) {
      throw new Error(`Invalid realm ${realm} was provided. Realm must be one of ${realms.join(',')}`);
    }

    const realmDomain = realm && realms.includes(realm) ? `.${realm.toLowerCase()}` : '';

    return `https://${subDomain}${realmDomain}.twilio.com/${version}`;
  }

/**
 * Constructs user agent with core
 * plugin builder packages
 */
  public static getUserAgent(packages: string[] = FLEX_PACKAGES): string {
    return getPackageDetails(packages)
            .reduce((userAgentString, pkg) =>
                `${userAgentString} ${pkg.name}/${pkg.found ? pkg.package.version : '?'}`, '')
            .trimLeft();
  }

  private static realms = ['dev', 'stage'];
  protected readonly config: HttpConfig;
  protected readonly http: Http;

  protected constructor(auth: AuthConfig, baseUrl: string, options?: BaseClientOptions) {
    const config: HttpConfig = {
      baseURL: baseUrl,
      userAgent: BaseClient.userAgent,
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
