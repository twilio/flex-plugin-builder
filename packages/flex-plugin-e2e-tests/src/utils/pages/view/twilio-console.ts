import { Page } from 'puppeteer';
import { logger } from '@twilio/flex-dev-utils';

import { testParams } from '../../../core';
import { Base } from './base';
import { sleep } from '../../timers';
import fetch, { Response, RequestInit } from 'node-fetch';
import fetchCookie from 'fetch-cookie';
import {CookieJar} from 'tough-cookie';

export class TwilioConsole extends Base {
  private static _loginForm = '#email';

  assert = {};

  private readonly _baseUrl: string;

  private readonly _flexBaseUrl: string;

  constructor(page: Page, { flex, twilioConsole }: { flex: string; twilioConsole: string }) {
    super(page);
    this._baseUrl = twilioConsole;
    this._flexBaseUrl = flex;
  }

  /**
   * Creates a localhost url
   * @param port
   */
  private static _createLocalhostUrl = (port: number) => `http://localhost:${port}&localPort=${port}`;

  private async fetchWithCookies(url: string, options: RequestInit = {}): Promise<Response> {
    const cookies = await this.page.cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    const headers = {
      ...(options.headers || {}),
      'Cookie': cookieHeader,
    };

    logger.info("headers", headers);

    return fetch(url, {
      ...options,
      headers,
    });
  }

  /**
   * Logs user in through service-login
   * @param cookies
   * @param flexBaseUrl
   * @param flexPath
   * @param accountSid
   */
  async login(flexPath: string, accountSid: string, localhostPort: number, firstLoad: boolean = true): Promise<void> {
    const cookieJar = new CookieJar();
    const fetchWithCookies = fetchCookie(fetch, cookieJar);

    logger.info('firstload', firstLoad);
    const redirectUrl = this._flexBaseUrl.includes('localhost')
      ? TwilioConsole._createLocalhostUrl(localhostPort)
      : this._flexBaseUrl;
    const path = `console/flex/service-login/${accountSid}/?path=/${flexPath}&referer=${redirectUrl}`;
    await this.goto({ baseUrl: this._baseUrl, path });

    logger.info("Before firstload")
    if (firstLoad) {
      await this.elementVisible(TwilioConsole._loginForm, `Twilio Console's Login form`);
      logger.info("Login form is visible, proceeding with login");

      let csrfToken = null;
      try {
        const csrfResponse = await fetchWithCookies('https://www.twilio.com/api/csrf', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        logger.info('Fetched CSRF response:', csrfResponse.status);
        const data = await csrfResponse.json();
        // @ts-ignore
        csrfToken = data.csrf;
        logger.info('CSRF response JSON:', data);
      } catch (e) {
        logger.error('CSRF fetch failed:', e);
        throw new Error('CSRF token is null');
      }

      if (!csrfToken) {
        logger.error("Unable to fetch CSRF token for Twilio Console login");
        throw new Error('CSRF token is null');
      }

      logger.info("CSRF token fetched, proceeding with login", csrfToken);
      const loginURL = `${this._baseUrl}/userauth/submitLoginPassword`;
      logger.info('loginURL', loginURL);

      try {
        const response = await this.fetchWithCookies(loginURL, {
          method: 'POST',
          headers: {
            'x-twilio-csrf': csrfToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: testParams.secrets.console.email,
            password: testParams.secrets.console.password,
          }),
        });

        const responseBody = await response.text();

        logger.info('Login response status:', response.status);
        const headersObj: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headersObj[key] = value;
        });
        logger.info('Login response headers:', headersObj);
        logger.info('Login response body:', responseBody);

        if (response.status !== 200) {
          throw new Error(`Login failed with status ${response.status}`);
        }

        logger.info('Login successful, proceeding to Flex');
        await this.goto({ baseUrl: this._baseUrl, path });
      } catch (e) {
        logger.error('Login request failed:', e);
        throw e;
      }
    }

    await sleep(60000);
  }
}
