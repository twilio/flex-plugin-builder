/* eslint-disable camelcase */
import { createReadStream } from 'fs';

import { HttpClient, FormData } from '@twilio/flex-dev-utils';

export interface Warning {
  file: string;
  warnings: {
    warningMessage: string;
    location?: {
      line: number;
      column: number;
    };
    recommendation: {
      code?: string;
      message: string;
      link?: string;
    };
  }[];
}

interface GenericWarning {
  file: string;
  messages: string[];
}

interface Error {
  file: string;
  message: string;
}

export interface ValidateReport {
  dom_manipulation: GenericWarning[];
  api_compatibility: Warning[];
  version_compatibility: Warning[];
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
  public validate = async (pluginZip: string, pluginName: string, flexUIVersion: string): Promise<ValidateReport> => {
    const form = new FormData();
    form.append('flex_ui_version', flexUIVersion);
    form.append('plugin_name', pluginName);
    form.append('plugin_zip', createReadStream(pluginZip));
    return this.http.upload('Validate', form);
  };
}
