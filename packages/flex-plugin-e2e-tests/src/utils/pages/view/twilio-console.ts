import { Page } from 'puppeteer';
import { logger } from '@twilio/flex-dev-utils';

import { testParams } from '../../../core';
import { Base } from './base';
import { sleep } from '../../timers';

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

  /**
   * Logs user in through service-login
   * @param cookies
   * @param flexBaseUrl
   * @param flexPath
   * @param accountSid
   */
  async login(flexPath: string, accountSid: string, localhostPort: number, firstLoad: boolean = true): Promise<void> {
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
        const response = await fetch('https://www.twilio.com/api/csrf');
        logger.info('Fetched CSRF response:', response.status);
        const data = await response.json();
        logger.info('CSRF response JSON:', data);
        csrfToken =  data.csrf;
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
        const response = await fetch(loginURL, {
          method: 'POST',
          headers: {
            'x-twilio-csrf': csrfToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: testParams.secrets.console.email,
            password: testParams.secrets.console.password,
          }),
          credentials: 'include', // not needed in node-fetch, but okay
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
