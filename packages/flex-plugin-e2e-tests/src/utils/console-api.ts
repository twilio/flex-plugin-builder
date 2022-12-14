import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '@twilio/flex-dev-utils';

const csrfTokenRegex = new RegExp(/name="csrfToken"\scontent="(.*?)"/m);
const twVisitorCookieRegex = new RegExp(/tw-visitor=(.*?);/m);
const identityCookieRegex = new RegExp(/identity=(.*?);/m);
const serverIdentityCookieRegex = new RegExp(/server-identity=(.*?);/m);

export interface ConsoleAuthOptions {
  email: string;
  password: string;
}

const SET_COOKIE = 'set-cookie';

export enum Cookie {
  visitor = 'tw-visitor',
  sIdentity = 'server-identity',
  identity = 'identity',
}

export interface Cookies {
  [Cookie.identity]: string | undefined;
  [Cookie.sIdentity]: string;
  [Cookie.visitor]: string;
}

/**
 * Defines interactions with Console API
 */
export class ConsoleAPI {
  private readonly baseUrl: string;

  private readonly consoleAuthOptions: ConsoleAuthOptions;

  /**
   * Initialises console base url and verifies console credentials
   * @param consoleBaseUrl base url of Twilio console
   * @param auth the {@link ConsoleAuthOptions}
   */
  constructor(consoleBaseUrl: string, auth: ConsoleAuthOptions) {
    this.baseUrl = consoleBaseUrl;
    this.consoleAuthOptions = auth;
  }

  /**
   * Extracts value from response header using regex
   * @param regex regex to apply
   * @param response response to be searched
   * @param matchName name of the entity being looked for
   */
  private static getValueFromResponse(regex: RegExp, response: string, matchName: string): string {
    const match = response.match(regex);

    if (!match || !match[1]) {
      logger.error(response);
      throw new Error(`Response does not contain ${matchName}`);
    }

    return match[1];
  }

  /**
   * Fetch response from the Twilio console endpoint
   * @param config request config to send
   */
  private static async getResponse(config: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      return axios(config);
    } catch (e: any) {
      logger.error(`${config.method}: ${config.url} returned code ${e.status}.`);
      throw new Error(e.message);
    }
  }

  /**
   * Get required cookies (tw-visitor, identity, server-identity) to authenticate
   */
  async getCookies(): Promise<Cookies> {
    const loginResponse = await ConsoleAPI.getResponse({ method: 'GET', url: `${this.baseUrl}/login` });

    const csrfToken = ConsoleAPI.getValueFromResponse(new RegExp(csrfTokenRegex), loginResponse.data, 'CSRF Token');

    const twVisitorCookie = ConsoleAPI.getValueFromResponse(
      new RegExp(twVisitorCookieRegex),
      loginResponse.headers?.[SET_COOKIE]?.join() || '',
      `${Cookie.visitor} cookie`,
    );

    const loginPasswordResponse = await ConsoleAPI.getResponse({
      method: 'POST',
      url: `${this.baseUrl}/userauth/submitLoginPassword`,
      withCredentials: true,
      maxRedirects: 0,
      headers: {
        'x-twilio-csrf': csrfToken,
        cookie: `tw-visitor=${twVisitorCookie}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      validateStatus: (status: number): boolean => status === 200,
      data: JSON.stringify({
        email: this.consoleAuthOptions.email,
        password: this.consoleAuthOptions.password,
        userType: 0,
      }),
    });

    const loginPasswordCookies = loginPasswordResponse.headers?.[SET_COOKIE]?.join() || '';

    const serverIdentityCookie = ConsoleAPI.getValueFromResponse(
      new RegExp(serverIdentityCookieRegex),
      loginPasswordCookies,
      `${Cookie.sIdentity} cookie`,
    );

    let identityCookie: string | undefined;

    try {
      identityCookie = ConsoleAPI.getValueFromResponse(
        new RegExp(identityCookieRegex),
        loginPasswordCookies,
        `${Cookie.identity} cookie`,
      );
    } catch (e) {
      identityCookie = undefined;
    }

    return {
      [Cookie.identity]: identityCookie,
      [Cookie.sIdentity]: serverIdentityCookie,
      [Cookie.visitor]: twVisitorCookie,
    };
  }
}
