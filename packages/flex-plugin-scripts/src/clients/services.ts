import { Credential } from 'flex-dev-utils';

import BaseClient from './baseClient';
import { Service, ServiceResource } from './serverless-types';

export default class ServiceClient extends BaseClient {
  public static BASE_URI = 'Services';
  public static NewService = {
    UniqueName: 'default',
    FriendlyName: 'Flex Plugins Default Service',
  };

  /**
   * Returns the base URL
   */
  public static getBaseUrl = (baseUrl = 'serverless'): string => {
    return BaseClient.getBaseUrl(baseUrl, ServiceClient.version);
  }

  private static version = 'v1';

  constructor(auth: Credential) {
    super(auth, ServiceClient.getBaseUrl());
  }

  /**
   * Fetches an instance of Serverless service
   *
   * @param sid the service sid
   */
  public get = (sid: string): Promise<Service> => {
    return this.http
      .get<Service>(`${ServiceClient.BASE_URI}/${sid}`);
  }

  /**
   * Fetches the default {@link Service}.
   */
  public getDefault = (): Promise<Service> => {
    return this.list()
      .then((resource) => resource.services.find((s) => s.unique_name === 'default'))
      .then((service) => {
        if (!service) {
          return this.create();
        }

        return service as Service;
      });
  }

  /**
   * Creates a {@link Service} with unique name `default`
   */
  public create = (): Promise<Service> => {
    return this.http
      .post(ServiceClient.BASE_URI, ServiceClient.NewService);
  }

  /**
   * Fetches the list of {@link Service}
   */
  public list = (): Promise<ServiceResource> => {
    return this.http
      .get<ServiceResource>(ServiceClient.BASE_URI);
  }
}
