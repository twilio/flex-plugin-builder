import { AuthConfig } from 'flex-dev-utils/dist/keytar';

import BaseClient from './baseClient';
import { Service, ServiceResource } from './serverless-types';

export default class ServiceClient extends BaseClient {
  public static getBaseUrl = (): string => {
    const realm = process.env.TWILIO_SERVERLESS_REALM;
    if (!realm) {
      return 'https://serverless.twilio.com/v1';
    }

    return `https://serverless.${realm.toLowerCase()}.twilio.com/v1`;
  }

  constructor(auth: AuthConfig) {
    super(auth, ServiceClient.getBaseUrl());
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
      .post('Services', {
        UniqueName: 'default',
        FriendlyName: 'Flex Plugins Default Service',
      });
  }

  /**
   * Fetches the list of {@link Service}
   */
  public list = (): Promise<ServiceResource> => {
    return this.http
      .get<ServiceResource>('Services');
  }
}
