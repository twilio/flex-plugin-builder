import { ElementHandle, Page } from 'puppeteer';

import { Base } from '../base';

export class AgentDesktop extends Base {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  assert = {
    isVisible: async (): Promise<ElementHandle<Element>> => this.elementVisible(this._noTaskCanvas, 'Task canvas'),
  };

  private readonly _noTaskCanvas = '.Twilio-NoTasksCanvas';

  private readonly _baseUrl: string;

  constructor(page: Page, baseUrl: string) {
    super(page);
    this._baseUrl = baseUrl;
  }

  async open(): Promise<void> {
    await this.goto({ baseUrl: this._baseUrl, path: 'agent-desktop' });
  }
}
