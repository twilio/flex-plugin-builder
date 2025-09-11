import { Page } from 'puppeteer';
import { logger } from '@twilio/flex-dev-utils';

import { testParams } from '../../../core';
import { Base } from './base';
import { sleep } from '../../timers';

interface CsrfResponse {
  csrf?: string;
}

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
   * @param flexPath
   * @param accountSid
   * @param localhostPort
   * @param firstLoad
   */
  async login(flexPath: string, accountSid: string, localhostPort: number, firstLoad: boolean = true): Promise<void> {
    logger.info('firstload', firstLoad);
    const redirectUrl = this._flexBaseUrl.includes('localhost')
      ? TwilioConsole._createLocalhostUrl(localhostPort)
      : this._flexBaseUrl;
    const path = `console/flex/service-login/${accountSid}/?path=/${flexPath}&referer=${redirectUrl}`;

    await Promise.all([
      this.page.waitForNavigation({
        waitUntil: 'load', // condition to consider navigation finished
        timeout: Base.DEFAULT_PAGE_LOAD_TIMEOUT,
      }),
      this.goto({ baseUrl: this._baseUrl, path }),
    ]);

    if (firstLoad) {
      await this.elementVisible(TwilioConsole._loginForm, `Twilio Console's Login form`);
      let csrfToken: string | null = null;
      let twVisitorCookie: string | null = null;
      try {
        const csrfResponse = await fetch(`${this._baseUrl}/api/csrf`, { method: 'GET' });
        const setCookieHeader = csrfResponse.headers.get('set-cookie');

        if (setCookieHeader) {
          const match = setCookieHeader.match(/tw-visitor=([^;]+);/);
          twVisitorCookie = match ? match[1] : null;
        }

        const data = await csrfResponse.json();
        csrfToken = (data as CsrfResponse).csrf || null;
      } catch (e) {
        logger.info('CSRF fetch failed:', e);
      }

      if (csrfToken && twVisitorCookie) {
        const loginURL = `${this._baseUrl}/userauth/submitLoginPassword`;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.page.setCookie({
          name: 'tw-visitor',
          value: twVisitorCookie,
        });
        const result = await this.page.evaluate(
          async function (data) {
            return fetch(data.url, {
              headers: {
                'x-twilio-csrf': data.csrfToken || '',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: data.email,
                password: data.password,
              }),
              credentials: 'include',
              method: 'POST',
            })
              .then((response) => {
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
              .catch((err) => {
                return {
                  error: err.message || 'Unknown error during fetch',
                };
              });
          },
          {
            url: loginURL,
            email: testParams.secrets.console.email,
            password: testParams.secrets.console.password,
            csrfToken,
            twVisitorCookie,
          },
        );
        logger.info('Fetch result from browser:', result);

        logger.info('Logging in Flex via service login on first load');
        await this.goto({ baseUrl: this._baseUrl, path });
      } else {
        logger.error('Unable to fetch CSRF token or tw-visitor cookie for Twilio Console login');
        throw new Error('Unable to fetch CSRF token or tw-visitor cookie to login to Twilio Console');
      }
    }

    await sleep(60000);
  }
}
