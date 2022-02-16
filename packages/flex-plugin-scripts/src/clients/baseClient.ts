import { Credential, env } from '@twilio/flex-dev-utils';

import Http, { ContentType, HttpConfig } from './http';
import { getPackageDetails, FLEX_PACKAGES } from '../utils/package';

export interface BaseClientOptions {
  contentType: ContentType;
}

export default abstract class BaseClient {
  public static userAgent = BaseClient.getUserAgent();

  private static regions = ['dev', 'stage'];

  protected readonly config: HttpConfig;

  protected readonly http: Http;

  protected constructor(auth: Credential, baseUrl: string, options?: BaseClientOptions) {
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

  /**
   * Returns the base URL
   */
  public static getBaseUrl = (subDomain: string, version: string): string => {
    const { regions } = BaseClient;
    const region = env.getRegion();
    if (region && !regions.includes(region)) {
      throw new Error(`Invalid region ${region} was provided. Region must be one of ${regions.join(',')}`);
    }

    const regionDomain = region && regions.includes(region) ? `.${region.toLowerCase()}` : '';

    return `https://${subDomain}${regionDomain}.twilio.com/${version}`;
  };

  /**
   * Constructs user agent with core
   * plugin builder packages
   */
  public static getUserAgent(packages: string[] = FLEX_PACKAGES): string {
    return getPackageDetails(packages)
      .reduce(
        (userAgentString, pkg) => `${userAgentString} ${pkg.name}/${pkg.found ? pkg.package.version : '?'}`,
        'Flex Plugin Builder',
      )
      .trimLeft();
  }
}
