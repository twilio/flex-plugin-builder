import { logger } from 'flex-plugins-utils-logger';
import { ElementHandle, Page } from 'puppeteer';

import { Base } from '../base';

interface PluginResponse {
  name: string;
  version: string;
  phase: number;
  src: string;
}

export class Plugins extends Base {
  assert = {
    plugin: {
      isVisible: async (pluginText: string): Promise<ElementHandle<Element>> =>
        this.elementVisible(this._plugin(pluginText), `Plugin with text: ${pluginText}`),
    },
  };

  private readonly _baseUrl: string;

  private readonly _pluginList = 'pre';

  constructor(page: Page, baseUrl: string) {
    super(page);
    this._baseUrl = baseUrl.includes('localhost') ? 'https://flex.twilio.com' : baseUrl;
  }

  /**
   * Retrieves all plugins from /plugins
   */
  async list(): Promise<PluginResponse[]> {
    await this.goto({ baseUrl: this._baseUrl, path: '/plugins' });

    const pluginListElementHandle = await this.elementVisible(this._pluginList, 'Plugins in PRE tag');
    const pluginListAsString = await this.getText(pluginListElementHandle, 'Plugins in PRE tag');

    try {
      return JSON.parse(pluginListAsString);
    } catch (e) {
      logger.error('Plugin list retrieved from the /plugins is not a valid JSON');
      throw e;
    }
  }

  /**
   * Creates selector for plugin based on its text
   */
  private _plugin = (text: string): string => `//div[contains(text(), '${text}')]`;
}
