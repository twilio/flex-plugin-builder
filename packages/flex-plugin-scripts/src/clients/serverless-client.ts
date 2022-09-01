import { HttpClient, OptionalHttpClientConfig } from '@twilio/flex-dev-utils';

/**
 * An implementation of the raw {@link HttpClient} but made for Serverless services
 */
export default class ServerlessClient extends HttpClient {
  private static version = 'v1';

  constructor(username: string, password: string, options?: OptionalHttpClientConfig) {
    super({
      ...options,
      baseURL: `https://serverless.twilio.com/${ServerlessClient.version}`,
      auth: { username, password },
      supportProxy: true,
    });
  }
}
