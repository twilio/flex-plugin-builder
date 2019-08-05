import { AuthConfig } from 'flex-dev-utils/dist/keytar';

import BaseClient from './baseClient';
import { Service, ServiceResource } from './serverless-types';

export default class ServiceClient extends BaseClient {
  public static NewService = {
    UniqueName: 'default',
    FriendlyName: 'Flex Plugins Default Service',
  };

  /**
   * Returns the base URL
   */
  public static getBaseUrl = (baseUrl = 'serverless'): string => {
    const realms = ServiceClient.realms;
    const realm = process.env.TWILIO_SERVERLESS_REALM;
    if (realm && !realms.includes(realm)) {
      throw new Error(`Invalid realm ${realm} was provided. Realm must be one of ${realms.join(',')}`);
    }

    const subDomain = realm && realms.includes(realm) ? `.${realm.toLowerCase()}` : '';

    return `https://${baseUrl}${subDomain}.twilio.com/${ServiceClient.version}`;
  }

  private static realms = ['dev', 'stage'];
  private static version = 'v1';

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
      .post('Services', ServiceClient.NewService);
  }

  /**
   * Fetches the list of {@link Service}
   */
  public list = (): Promise<ServiceResource> => {
    return this.http
      .get<ServiceResource>('Services');
  }
}
