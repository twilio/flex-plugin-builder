import { Page } from 'puppeteer';

import { Base } from './base';
import { Cookie, Cookies } from '../../console-api';
import { testParams } from '../../../core';
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
  async login(
    cookies: Cookies,
    flexPath: string,
    accountSid: string,
    localhostPort: number,
    firstLoad: boolean = true,
  ): Promise<void> {
    const redirectUrl = this._flexBaseUrl.includes('localhost')
      ? TwilioConsole._createLocalhostUrl(localhostPort)
      : this._flexBaseUrl;
    const path = `console/flex/service-login/${accountSid}/?path=/${flexPath}&referer=${redirectUrl}`;

    await this.goto({ baseUrl: this._baseUrl, path });

    if (firstLoad) {
      await this.elementVisible(TwilioConsole._loginForm, `Twilio Console's Login form`);
      try {
        await this.page.type('#email', testParams.secrets.console.email);
        await this.page.click('#email-next');
      } catch (e) {
        throw new Error('Email or next button not found');
      }
      await this.page.waitForTimeout(2000);
      try {
        await this.page.type('#password', testParams.secrets.console.password);
        await this.page.waitForTimeout(2000);
        await this.page.click('#login');
      } catch (e) {
        throw new Error('Password field or login button not found');
      }
      await this.page.waitForTimeout(2000);
      await this.goto({ baseUrl: this._baseUrl, path });
    }

    await sleep(30000);
  }
}
