import { Page } from 'puppeteer';

import { Base } from './base';
import { Cookie, Cookies } from '../../console-api';
import { testParams } from '../../../core';
import { sleep } from '../../timers';

export class TwilioConsole extends Base {
  private static _loginForm = '#email';

  private static _password = '#password';

  private static _nextBtn = '#email-next';

  private static _loginBtn = '#login';

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
      await this.inputText(TwilioConsole._loginForm, testParams.secrets.console.email);
      await this.click(TwilioConsole._nextBtn);
      await this.inputText(TwilioConsole._password, testParams.secrets.console.password);
      await this.click(TwilioConsole._loginBtn);
      await this.page.waitForTimeout(4000);
      await this.goto({ baseUrl: this._baseUrl, path });
    }

    await sleep(30000);
  }
}
