/* eslint-disable camelcase */
import { HttpClient } from '@twilio/flex-dev-utils';

export interface Account {
  auth_token?: string;
  friendly_name?: string;
  sid: string;
}

export default class AccountClient {
  public static version = '2010-04-01';

  private readonly client: HttpClient;

  constructor(username: string, password: string) {
    this.client = new HttpClient({
      baseURL: `https://api.twilio.com/${AccountClient.version}`,
      auth: { username, password },
      supportProxy: true,
    });
  }

  /**
   * Returns the Account object
   *
   * @param sid the account sid to lookup
   */
  public get = async (sid: string): Promise<Account> => {
    return this.client.get<Account>(`Accounts/${sid}.json`);
  };
}
