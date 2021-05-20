import { stringify } from 'querystring';

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from 'flex-plugins-utils-logger';

interface ConsoleAuthOptions {
  email: string | undefined;
  password: string | undefined;
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
  private baseUrl: string;

  private consoleAuthOptions: ConsoleAuthOptions;

  constructor(consoleBaseUrl: string) {
    this.baseUrl = consoleBaseUrl;

    if (!process.env.CONSOLE_EMAIL || !process.env.CONSOLE_PASSWORD) {
      throw new Error('Please export CONSOLE_EMAIL; CONSOLE_PASSWORD');
    }

    this.consoleAuthOptions = {
      email: process.env.CONSOLE_EMAIL,
      password: process.env.CONSOLE_PASSWORD,
    };
  }

  /**
   * Get cookies to authenticate
   */
  async getCookies(): Promise<Cookies> {
    const loginResponse = await this.getResponse({ method: 'GET', url: `${this.baseUrl}/login` });

    const csrfToken = this.getValueFromResponse(
      new RegExp(/name="CSRF"\svalue="(.*?)"/m),
      loginResponse.data,
      'CSRF Token',
    );

    const twVisitorCookie = this.getValueFromResponse(
      new RegExp(/tw-visitor=(.*?);/m),
      loginResponse.headers[SET_COOKIE].join(),
      `${Cookie.visitor} cookie`,
    );

    const loginPasswordResponse = await this.getResponse({
      method: 'POST',
      url: `${this.baseUrl}/login/password`,
      withCredentials: true,
      maxRedirects: 0,
      headers: {
        cookie: `${Cookie.visitor}=${twVisitorCookie}`,
      },
      validateStatus: (status: number): boolean => status === 302,
      data: stringify({
        CSRF: csrfToken,
        email: this.consoleAuthOptions.email,
        password: this.consoleAuthOptions.password,
      }),
    });

    const loginPasswordCookies = loginPasswordResponse.headers[SET_COOKIE].join();

    const serverIdentityCookie = this.getValueFromResponse(
      new RegExp(/server-identity=(.*?);/m),
      loginPasswordCookies,
      `${Cookie.sIdentity} cookie`,
    );

    let identityCookie: string | undefined;

    try {
      identityCookie = this.getValueFromResponse(
        new RegExp(/identity=(.*?);/m),
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

  private getValueFromResponse(regex: RegExp, response: string, matchName: string): string {
    const match = response.match(regex);

    if (!match || !match[1]) {
      logger.error(response);
      throw new Error(`Response does not contain ${matchName}`);
    }

    return match[1];
  }

  private async getResponse(config: AxiosRequestConfig): Promise<AxiosResponse> {
    let response: AxiosResponse;
    try {
      response = await axios(config);
    } catch (e) {
      logger.error(`${config.method}: ${config.url} returned code ${e.status}.`);
      throw new Error(e);
    }

    return response;
  }
}
