import { AuthConfig } from 'flex-dev-utils/dist/credentials';

import Http, { ContentType, HttpConfig } from './http';

export interface BaseClientOptions {
  contentType: ContentType;
}

export default abstract class BaseClient {
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
