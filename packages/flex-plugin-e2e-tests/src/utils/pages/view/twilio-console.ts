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
        logger.info('CSRF fetch failed:', e);
      }

      logger.info("CSRF token fetched, proceeding with login", csrfToken);
      if (csrfToken) {
        const loginURL = `${this._baseUrl}/userauth/submitLoginPassword`;
        logger.info('loginURL', loginURL);

        const loginData = {
          url: loginURL,
          email: testParams.secrets.console.email,
          password: testParams.secrets.console.password,
          csrfToken,
        };

        const result = await this.page.evaluate((data) => {
          return fetch(data.url, {
            headers: {
              'X-Twilio-Csrf': data.csrfToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: data.email,
              password: data.password,
            }),
            method: 'POST',
            credentials: 'include',
          })
              .then(response => {
                return {
                  status: response.status,
                  headers: (() => {
                    const headersObj = {};
                    response.headers.forEach((value, key) => {
                      headersObj[key] = value;
                    });
                    return headersObj;
                  })(),
                };
              })
              .catch(err => {
                return {
                  error: err.message || 'Unknown error during fetch',
                };
              });
        }, loginData);

        logger.info('Fetch result from browser:', result);

        logger.info('Logging in Flex via service login on first load');
        await this.goto({ baseUrl: this._baseUrl, path });

      } else {
        logger.error("Unable to fetch CSRF token for Twilio Console login");
        throw new Error('Unable to fetch CSRF token to login to Twilio Console');
      }
    }

    await sleep(60000);
  }
}
