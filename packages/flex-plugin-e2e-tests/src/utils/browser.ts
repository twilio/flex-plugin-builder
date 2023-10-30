import { logger } from '@twilio/flex-dev-utils';
import Puppeteer, { Browser as PuppeteerBrowser, Page, ConsoleMessage, ConsoleMessageType } from 'puppeteer';

import assertion from './assertion';
import { App, BaseUrl } from './pages';

export class Browser {
  static app: App;

  private static _browser: PuppeteerBrowser;

  private static _page: Page;

  private static _domainsToInclude = ['twilio', 'localhost', 'unpkg'];

  /**
   * Initializes browser object
   */
  static async create(baseUrls: BaseUrl): Promise<void> {
    this._browser = await Puppeteer.launch({ headless: true, args: ['--use-fake-ui-for-media-stream'] });
    this._page = await this._browser.newPage();
    await this._page.setRequestInterception(true);
    this._attachLogListener();
    this._attachNetworkInterceptor();
    this.app = new App(this._page, baseUrls);
    assertion.app.init(this.app);
  }

  static async loadNewPage(baseUrls: BaseUrl): Promise<void> {
    this._page = await this._browser.newPage();
    await this._page.setRequestInterception(true);
    this._attachLogListener();
    this._attachNetworkInterceptor();
    this.app = new App(this._page, baseUrls);
    assertion.app.init(this.app);
  }

  static async kill(): Promise<void> {
    try {
      this._page.removeAllListeners();
      await this._browser.close();
    } catch (e) {
      logger.error('Failed to quit browser');
    }
  }

  /**
   * Attach browser log listener
   */
  private static _attachNetworkInterceptor(): void {
    this._page.on('request', async (request): Promise<void> => {
      // Ignoring any 3rd part requests to speed up Twilio console load time
      const url = request.url();
      const re = new RegExp(this._domainsToInclude.join('|'));

      if (request.resourceType() === 'script' && !re.test(url)) {
        return request.abort();
      }
      return request.continue();
    });
  }

  /**
   * Attach network interceptor
   */
  private static _attachLogListener(): void {
    this._page.on('console', (msg: ConsoleMessage) => {
      const logTypes: ConsoleMessageType[] = ['error'];

      const url = msg.location().url || '';
      const re = new RegExp(this._domainsToInclude.join('|'));

      if (logTypes.includes(msg.type()) && re.test(url)) {
        logger.error({
          msg: msg.text(),
          url,
          args: msg.args() || '',
          lineNumber: msg.location().lineNumber,
          colNumber: msg.location().columnNumber,
          stackTrace: msg.stackTrace() || '',
        });
      }
    });
  }
}
