import { ElementHandle, Page } from 'puppeteer';

import { Base } from './base';

export class AdminDashboard extends Base {
  private static readonly _welcomeBanner = '.welcome-banner';

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  assert = {
    /**
     * Checks whether Welcome Banner is visible on Admin Dashboard
     */
    isVisible: async (): Promise<ElementHandle<Element>> =>
      this.elementVisible(AdminDashboard._welcomeBanner, 'Welcome banner'),
  };

  private readonly _baseUrl: string;

  constructor(page: Page, baseUrl: string) {
    super(page);
    this._baseUrl = baseUrl;
  }

  /**
   * Navigates to Admin Dashboard
   */
  async open(): Promise<void> {
    await this.goto({ baseUrl: this._baseUrl, path: 'admin' });
  }
}
