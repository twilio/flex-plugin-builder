import { HttpClient, OptionalHttpClientConfig } from '@twilio/flex-dev-utils';
/**
 * An implementation of the raw {@link HttpClient} but made for Serverless services
 */
export default class ServerlessClient extends HttpClient {
    private static version;
    constructor(username: string, password: string, options?: OptionalHttpClientConfig);
}
