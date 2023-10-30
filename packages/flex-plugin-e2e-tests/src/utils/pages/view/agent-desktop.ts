import { ElementHandle, Page } from 'puppeteer';

import { Base } from './base';

export class AgentDesktop extends Base {
  private static readonly _noTaskCanvas = '.Twilio-NoTasksCanvas';

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  assert = {
    /**
     * Checks whether task canvas are visible on the Agent Desktop
     */
    isVisible: async (): Promise<ElementHandle<Element>> =>
      this.elementVisible(AgentDesktop._noTaskCanvas, 'Task canvas'),
  };

  private readonly _baseUrl: string;

  constructor(page: Page, baseUrl: string) {
    super(page);
    this._baseUrl = baseUrl;
  }

  /**
   * Clears the page
   */
  async clear(): Promise<void> {
    await this.goto({ baseUrl: 'about:blank' });
  }

  /**
   * Navigates to Agent Desktop
   */
  async open(): Promise<void> {
    await this.goto({ baseUrl: this._baseUrl, path: 'agent-desktop' });
  }
}
