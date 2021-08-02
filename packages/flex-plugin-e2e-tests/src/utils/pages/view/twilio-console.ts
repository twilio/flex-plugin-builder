import { Page } from 'puppeteer';

import { Base } from '../base';
import { Cookie, Cookies } from '../../console-api';

export class TwilioConsole extends Base {
  private static _loginForm = 'form[method="post"';

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
  async login(cookies: Cookies, flexPath: string, accountSid: string, localhostPort: number): Promise<void> {
    const redirectUrl = this._flexBaseUrl.includes('localhost')
      ? TwilioConsole._createLocalhostUrl(localhostPort)
      : this._flexBaseUrl;
    const path = `console/flex/service-login/${accountSid}/?path=/${flexPath}&referer=${redirectUrl}`;

    await this.goto({ baseUrl: this._baseUrl, path });
    await this.elementVisible(TwilioConsole._loginForm, `Twilio Console's Login form`);

    const requiredCookies = [
      { name: Cookie.visitor, value: cookies[Cookie.visitor] },
      { name: Cookie.sIdentity, value: cookies[Cookie.sIdentity] },
    ];

    if (cookies.identity) {
      requiredCookies.push({ name: Cookie.identity, value: cookies[Cookie.identity] as string });
    }

    // Set console cookies
    await this.page.setCookie(...requiredCookies);

    // Log in Flex via service login
    await this.goto({ baseUrl: this._baseUrl, path });
  }
}
