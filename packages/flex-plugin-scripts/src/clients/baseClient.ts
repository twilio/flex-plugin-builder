import { AuthConfig } from 'flex-dev-utils/dist/credentials';

import Http, { HttpConfig } from './http';

export default abstract class BaseClient {
  protected readonly config: HttpConfig;
  protected readonly http: Http;

  protected constructor(auth: AuthConfig, baseUrl: string) {
    this.config = {
      baseURL: baseUrl,
      auth,
      exitOnRejection: true,
    };

    this.http = new Http(this.config);
  }
}
