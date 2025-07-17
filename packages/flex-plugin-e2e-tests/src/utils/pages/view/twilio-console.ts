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

    if (firstLoad) {
      await this.elementVisible(TwilioConsole._loginForm, `Twilio Console's Login form`);
      const csrfToken = await this.page.evaluate(async () => {
        const response = await fetch('https://www.twilio.com/api/csrf', {
          credentials: 'include',
        });
        const data = await response.json();
        return JSON.parse(data.body).csrf;
      });

      if (csrfToken) {
        const loginURL = `${this._baseUrl}/userauth/submitLoginPassword`;
        await this.page.evaluate(
          // eslint-disable-next-line @typescript-eslint/promise-function-async
          (data: Record<string, string>) => {
            return fetch(data.url, {
              headers: {
                'x-twilio-csrf': data.csrfToken,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: data.email,
                password: data.password,
              }),
              method: 'POST',
              credentials: 'include',
            });
          },
          {
            url: loginURL,
            email: testParams.secrets.console.email,
            password: testParams.secrets.console.password,
            csrfToken,
          },
        );

        // Log in Flex via service login
        logger.info('Logging in Flex via service login on first load');
        await this.goto({ baseUrl: this._baseUrl, path });
      } else {
        throw new Error('Unable to fetch CSRF token to login to Twilio Console');
      }
    }

    await sleep(60000);
  }
}
