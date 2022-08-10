/* eslint-disable camelcase */
import { PaginationMeta } from '@twilio/flex-dev-utils';

import ServerlessClient from './serverless-client';

export interface ServerlessService {
  sid: string;
  account_sid: string;
  url: string;
  date_updated: string;
  date_created: string;
  unique_name: string;
  include_credentials: boolean;
  friendly_name: string;
  links: {
    functions: string;
    assets: string;
    environments: string;
    builds: string;
  };
}

const RESPONSE_KEY = 'services';

// eslint-disable-next-line import/no-unused-modules
export interface ServerlessServiceResourcePage extends PaginationMeta {
  [RESPONSE_KEY]: ServerlessService[];
}

export default class ServiceClient {
  public static NewService = {
    UniqueName: 'default',
    FriendlyName: 'Flex Plugins Default Service',
  };

  private readonly http: ServerlessClient;

  constructor(http: ServerlessClient) {
    this.http = http;
  }

  /**
   * Fetches an instance of Serverless service
   *
   * @param sid the service sid
   */
  public get = async (sid: string): Promise<ServerlessService> => {
    return this.http.get<ServerlessService>(`Services/${sid}`);
  };

  /**
   * Fetches the default {@link Service}.
   */
  public getDefault = async (): Promise<ServerlessService> => {
    const resource = await this.http.list<ServerlessServiceResourcePage>('Services', RESPONSE_KEY);
    const service = resource.services.find((s) => s.unique_name === 'default');
    if (service) {
      return service;
    }

    return this.create();
  };

  /**
   * Creates a {@link Service} with unique name `default`
   */
  public create = async (): Promise<ServerlessService> => {
    return this.http.post('Services', ServiceClient.NewService);
  };
}
