import { AuthConfig } from 'flex-dev-utils/dist/credentials';
import { Account } from './account-types';
import BaseClient from './baseClient';

export default class AccountClient extends BaseClient {
  public static BaseUrl = 'Accounts';
  public static version = '2010-04-01';

  /**
   * Gets the base URL
   */
  public static getBaseUrl = (): string => {
    return BaseClient.getBaseUrl('api', AccountClient.version);
  }

  constructor(auth: AuthConfig) {
    super(auth, AccountClient.getBaseUrl(), { contentType: 'application/json' });
  }

  /**
   * Returns the Account object
   *
   * @param sid the account sid to lookup
   */
  public get = (sid: string): Promise<Account> => {
    return this.http
      .get<Account>(`${AccountClient.BaseUrl}/${sid}.json`);
  }
}
