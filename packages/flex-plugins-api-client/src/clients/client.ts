import { Realm } from 'flex-plugins-utils-env';
import { OptionalHttpConfig } from 'flex-plugin-utils-http';

import ServiceHttpClient from './serviceHttpClient';

export interface PluginServiceHttpOption extends OptionalHttpConfig {
  realm?: Realm;
}

/**
 * An implementation of the raw {@link HttpClient} but made for PluginService
 */
export default class PluginServiceHttp extends ServiceHttpClient {
  private static version = 'v1';

  constructor(username: string, password: string, options?: PluginServiceHttpOption) {
    // eslint-disable-next-line  global-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const pkg = require('../../package.json');
    const caller = (options && options.caller) || pkg.name;
    const packages = (options && options.packages) || {};
    packages[pkg.name] = pkg.version;

    super({
      ...options,
      baseURL: `https://flex-api${PluginServiceHttp.getRealm(options && options.realm)}.twilio.com/${
        PluginServiceHttp.version
      }/PluginService`,
      auth: { username, password },
      caller,
      packages,
    });
  }
}
