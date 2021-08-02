import { ElementHandle, Page } from 'puppeteer';

import { Base } from '../base';

export class AdminDashboard extends Base {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  assert = {
    /**
     * Checks whether Welcome Banner is visible on Admin Dashboard
     */
    isVisible: async (): Promise<ElementHandle<Element>> => this.elementVisible(this._welcomeBanner, 'Welcome banner'),
  };

  private readonly _welcomeBanner = '.welcome-banner';

  private readonly _path = '/admin';

  private readonly _baseUrl: string;

  constructor(page: Page, baseUrl: string) {
    super(page);
    this._baseUrl = baseUrl;
  }
}
