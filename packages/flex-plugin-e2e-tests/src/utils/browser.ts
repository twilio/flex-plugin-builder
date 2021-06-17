import { logger } from 'flex-plugins-utils-logger';
import { Builder, WebDriver, WebElement, until, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

import { Cookies, Cookie } from './console-api';
import { testParams } from '../core';

const DEFAULT_LOCATE_TIMEOUT = 15000;
const DEFAULT_PAGE_LOAD_TIMEOUT = 60000;

interface PluginResponse {
  name: string;
  version: string;
  phase: number;
  src: string;
}

type FlexPath = 'agent-desktop' | 'admin';
type FlexView = 'Agent Desktop' | 'Admin Dashboard';

/**
 * Manages instantiation and interactions with browser
 */
export class Browser {
  static browser: WebDriver;

  static pageObjects = {
    console: {
      loginPage: {
        form: By.css("form[method='post'"),
      },
    },
    flex: {
      agentDesktop: {
        plugin: (pluginText: string): By => By.xpath(`//div[contains(text(), '${pluginText}')]`),
        noTaskCanvas: By.css('.Twilio-NoTasksCanvas'),
      },
      adminDashboard: {
        welcomeBanner: By.css('.welcome-banner'),
      },
      plugins: {
        list: By.css('pre'),
      },
    },
  };

  static assert = {
    pluginIsVisible: async (pluginComponentText: string): Promise<void> => Browser.pluginIsVisible(pluginComponentText),
    userIsOnView: async (view: FlexView): Promise<void> => Browser.userIsOnView(view),
  };

  /**
   * Initializes browser object
   */
  static async create(): Promise<void> {
    const opts = new chrome.Options();

    opts.addArguments(
      'allow-file-access-from-files',
      'use-fake-device-for-media-stream',
      'use-fake-ui-for-media-stream',
      '--disable-web-security',
      '--allow-file-access',
      '--headless',
      'no-sandbox',
    );

    await new Builder()
      .withCapabilities({ browserName: 'chrome' })
      .setChromeOptions(opts)
      .build()
      .then((driver) => {
        this.browser = driver;
      })
      .catch((e) => {
        throw e;
      });
  }

  /**
   * Attempts to quit browser. Doesn't throw on failure
   */
  static async kill(): Promise<void> {
    try {
      await this.browser.quit();
    } catch (e) {
      logger.error('Failed to quit browser');
    }
  }

  /**
   * Sets console cookies and logs into Flex via service login
   * @param cookies cookies to set
   * @param consoleBaseUrl Twilio console base url
   * @param flexBaseUrl base url of the flex
   * @param flexPath flex path to navigate to after logging in
   */
  static async loginViaConsole(
    cookies: Cookies,
    consoleBaseUrl: string,
    flexBaseUrl: string,
    flexPath: FlexPath,
  ): Promise<void> {
    const serviceLoginUrl = `${consoleBaseUrl}/console/flex/service-login/${
      testParams.secrets.api.accountSid
    }/?path=/${flexPath}&referer=${
      flexBaseUrl.includes('localhost') ? 'http://localhost:3000&localPort=3000' : flexBaseUrl
    }`;

    // Open Twilio console to set cookies
    await this.browser.get(serviceLoginUrl);
    await this.elementExistsAndIsVisible(
      this.pageObjects.console.loginPage.form,
      'Login Form',
      DEFAULT_PAGE_LOAD_TIMEOUT,
      DEFAULT_PAGE_LOAD_TIMEOUT,
    );

    // Set console cookies
    await this.browser.manage().addCookie({ name: Cookie.visitor, value: cookies[Cookie.visitor] });
    await this.browser.manage().addCookie({ name: Cookie.sIdentity, value: cookies[Cookie.sIdentity] });

    if (cookies.identity) {
      await this.browser.manage().addCookie({ name: Cookie.identity, value: cookies[Cookie.identity] as string });
    }

    // Log in Flex via service login
    await this.browser.get(serviceLoginUrl);
  }

  /**
   * Open the given path in browser
   * @param flexBaseUrl base url of the Flex
   * @param path path to navigate to
   */
  static async navigate(flexBaseUrl: string, path: FlexPath): Promise<void> {
    await this.browser.get(`${flexBaseUrl}/${path}`);
  }

  /**
   * Returns all plugins from the /plugins endpoint
   * @param flexBaseUrl base url of the Flex
   */
  static async getPluginResponse(flexBaseUrl: string): Promise<PluginResponse[]> {
    await this.browser.get(`${flexBaseUrl}/plugins`);

    const pluginListEle = await this.elementExists(this.pageObjects.flex.plugins.list, 'Plugin List PRE block');
    const pluginListString = await pluginListEle.getText();

    let pluginList;
    try {
      pluginList = JSON.parse(pluginListString);
    } catch (e) {
      logger.error('Plugin list retrieved from the /plugins is not a valid JSON');
      throw e;
    }
    return pluginList;
  }

  /**
   * Checks that plugin exists in DOM and is visible in UI
   * @param pluginComponentText text to identify plugin by
   */
  private static async pluginIsVisible(pluginComponentText: string): Promise<void> {
    await this.elementExistsAndIsVisible(
      this.pageObjects.flex.agentDesktop.plugin(pluginComponentText),
      'Plugin element',
    );
  }

  /**
   * Ensures that user is on the correct view
   * @param view name of view on which user should be
   */
  private static async userIsOnView(view: FlexView): Promise<void> {
    let locator: By;

    if (view === 'Admin Dashboard') {
      locator = this.pageObjects.flex.adminDashboard.welcomeBanner;
    } else if (view === 'Agent Desktop') {
      locator = this.pageObjects.flex.agentDesktop.noTaskCanvas;
    } else {
      throw new Error(`${view} is not a valid view`);
    }

    await this.elementExistsAndIsVisible(locator, view, DEFAULT_PAGE_LOAD_TIMEOUT, DEFAULT_PAGE_LOAD_TIMEOUT);
  }

  /**
   * Checks that element exists in DOM and is visible in UI
   * @param locator selector wrapped in By
   * @param elementName name of the searchable element
   * @param existTimeout time to wait for until element is located in DOM
   * @param visibleTimeout time to wait for until element is visible in the UI
   */
  private static async elementExistsAndIsVisible(
    locator: By,
    elementName: string,
    existTimeout = DEFAULT_LOCATE_TIMEOUT,
    visibleTimeout = DEFAULT_LOCATE_TIMEOUT,
  ): Promise<void> {
    const element = await this.elementExists(locator, elementName, existTimeout);
    await this.elementIsVisible(element, elementName, visibleTimeout);
  }

  /**
   * Check that element exists in the DOM
   * @param locator selector wrapped in By
   * @param elementName name of the searchable element
   * @param timeout time to wait for until element is located in DOM
   */
  private static async elementExists(
    locator: By,
    elementName: string,
    timeout = DEFAULT_LOCATE_TIMEOUT,
  ): Promise<WebElement> {
    try {
      return await this.browser.wait(until.elementLocated(locator), timeout, `Could not find ${elementName} in DOM`);
    } catch (e) {
      logger.error(`Did not find locator [${locator}] for element: ${elementName} in DOM`);
      throw new Error(e);
    }
  }

  /**
   * Check that element is visible
   * @param element element which should be visible
   * @param elementName name of the searchable element
   * @param timeout time to wait for until element is visible in the UI
   */
  private static async elementIsVisible(
    element: WebElement,
    elementName: string,
    timeout = DEFAULT_LOCATE_TIMEOUT,
  ): Promise<void> {
    try {
      await this.browser.wait(until.elementIsVisible(element), timeout, `Could not find ${elementName} in DOM`);
    } catch (e) {
      logger.error(`Element: ${elementName} is not visible in the UI`);
      throw new Error(e);
    }
  }
}
