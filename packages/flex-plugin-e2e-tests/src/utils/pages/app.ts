import { existsSync, mkdirSync } from 'fs';

import { Page } from 'puppeteer';

import { joinPath } from '..';
import { AdminDashboard } from './view/admin-dashboard';
import { AgentDesktop } from './view/agent-desktop';
import { Plugins } from './view/plugins';
import { TwilioConsole } from './view/twilio-console';

const screenshotExtension = '.png';

export interface BaseUrl {
  flex: string;
  twilioConsole: string;
}

export class App {
  assert: {
    agentDesktop: InstanceType<typeof AgentDesktop>['assert'];
    adminDashboard: InstanceType<typeof AdminDashboard>['assert'];
    twilioConsole: InstanceType<typeof TwilioConsole>['assert'];
    plugins: InstanceType<typeof Plugins>['assert'];
  };

  private readonly _agentDesktop: AgentDesktop;

  private readonly _adminDashboard: AdminDashboard;

  private readonly _twilioConsole: TwilioConsole;

  private readonly _plugins: Plugins;

  private readonly _page: Page;

  constructor(page: Page, { flex, twilioConsole }: BaseUrl) {
    this._page = page;
    this._agentDesktop = new AgentDesktop(page, flex);
    this._adminDashboard = new AdminDashboard(page, flex);
    this._twilioConsole = new TwilioConsole(page, { twilioConsole, flex });
    this._plugins = new Plugins(page, flex);
    this.assert = {
      agentDesktop: this._agentDesktop.assert,
      adminDashboard: this._adminDashboard.assert,
      twilioConsole: this._twilioConsole.assert,
      plugins: this._plugins.assert,
    };
  }

  get agentDesktop(): Omit<AgentDesktop, 'assert'> {
    return this._agentDesktop;
  }

  get adminDashboard(): Omit<AdminDashboard, 'assert'> {
    return this._adminDashboard;
  }

  get plugins(): Omit<Plugins, 'assert'> {
    return this._plugins;
  }

  get twilioConsole(): Omit<TwilioConsole, 'assert'> {
    return this._twilioConsole;
  }

  /**
   * Gets account sid from browser's console
   */
  async getFlexAccountSid(): Promise<string> {
    // In scope of code Twilio does not exist. This is done to avoid using eval
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let Twilio: any;
    return <Promise<string>>this._page.evaluate(() => {
      return Twilio.Flex.Manager.getInstance().serviceConfiguration.account_sid;
    });
  }

  /**
   * Takes screenshot of the current page
   * @param rootDir
   * @param screenshotName
   */
  async takeScreenshot(rootDir: string, screenshotName = `on_failure.${screenshotExtension}`): Promise<void> {
    const screenshotDir = joinPath(rootDir, 'screenshots');

    if (!screenshotName.endsWith(screenshotExtension)) {
      screenshotName += screenshotExtension;
    }

    if (!existsSync(screenshotDir)) {
      mkdirSync(screenshotDir);
    }

    await this._page.screenshot({ path: joinPath(screenshotDir, screenshotName) });
  }
}
