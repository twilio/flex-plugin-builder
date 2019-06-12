import { AuthConfig } from './auth';
import BaseClient from './baseClient';
import { Service, ServiceResource } from './serverless-types';

export default class ServiceClient extends BaseClient {
  public static baseUrl: string = 'https://serverless.twilio.com/v1';

  constructor(auth: AuthConfig) {
    super(auth, ServiceClient.baseUrl);
  }

  /**
   * Fetches the default {@link Service}
   */
  public getDefault = (): Promise<Service> => {
    return this.list()
      .then(resource => resource.services.find(s => s.unique_name === 'default'))
      .then(service => {
        if (!service) {
          throw new Error('No Runtime service named default was found.');
        }

        return service as Service;
      });
  };

  /**
   * Fetches the list of {@link Service}
   */
  public list = (): Promise<ServiceResource> => {
    return this.http
      .get<ServiceResource>('Services');
  };
}
