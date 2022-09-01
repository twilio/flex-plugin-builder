import { HttpClient, OptionalHttpClientConfig } from '@twilio/flex-dev-utils';

export type PluginServiceHttpOption = OptionalHttpClientConfig;

/**
 * An implementation of the raw {@link HttpClient} but made for PluginService
 */
export default class PluginServiceHttp extends HttpClient {
  private static version = 'v1';

  constructor(username: string, password: string, options?: PluginServiceHttpOption) {
    // eslint-disable-next-line  global-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const pkg = require('../../package.json');
    const caller = (options && options.caller) || pkg.name;
    const packages = (options && options.packages) || {};
    packages[pkg.name] = pkg.version;

    super({
      ...options,
      baseURL: `https://flex-api.twilio.com/${PluginServiceHttp.version}/PluginService`,
      auth: { username, password },
      caller,
      packages,
      supportProxy: true,
    });
  }
}
