/* eslint-disable camelcase */
import { createReadStream } from 'fs';

import { HttpClient, FormData } from '@twilio/flex-dev-utils';

interface Warning {
  file: string;
  messages: string[];
}

interface Error {
  file: string;
  message: string;
}

interface ValidateReport {
  dom_manipulation: Warning[];
  deprecated_api_usage: Warning[];
  version_incompatibility: Warning[];
  errors: Error[];
}

export default class GovernorClient {
  private static version = 'v1';

  private readonly http: HttpClient;

  constructor(username: string, password: string) {
    this.http = new HttpClient({
      baseURL: `https://flex-plugin-upload.dev.twilio.com/${GovernorClient.version}/Plugin`,
      auth: { username, password },
      supportProxy: true,
    });
  }

  /**
   * Returns the {@link ValidateReport}
   */
  public validate = async (pluginZip: string): Promise<ValidateReport> => {
    const form = new FormData();
    form.append('plugin_zip', createReadStream(pluginZip));
    return this.http.upload('Validate', form);
  };
}
