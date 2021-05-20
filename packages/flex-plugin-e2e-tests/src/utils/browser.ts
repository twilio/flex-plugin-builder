import { logger } from 'flex-plugins-utils-logger';
import { Builder, WebDriver, WebElement, until, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

import { Cookies, Cookie } from './console-api';

export class Browser {
  static browser: WebDriver;

  static pageObjects = {
    console: {
      loginPage: {
        form: By.css("form[method='post'"),
      },
    },
    flex: {
      loginPage: {
        serviceLoginLink: By.css('a > span'),
      },
      agentDesktop: {
        plugin: (pluginText: string): By => By.xpath(`//div[contains(text(), '${pluginText}')]`),
        noTaskCanvas: By.css('.Twilio-NoTasksCanvas'),
      },
    },
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
      // '--headless',
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
   * Checks that plugin exists in DOM and is visible in UI
   */
  static async pluginIsVisible(pluginComponentText: string): Promise<void> {
    await this.elementExistsAndIsVisible(
      this.pageObjects.flex.agentDesktop.plugin(pluginComponentText),
      'Plugin element',
      15000,
      15000,
    );
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
   */
  static async loginViaConsole(cookies: Cookies, consoleBaseUrl: string, flexBaseUrl: string): Promise<void> {
    // Set console cookies
    await this.browser.get(`${consoleBaseUrl}/login`);
    await this.elementExistsAndIsVisible(this.pageObjects.console.loginPage.form, 'Login Form', 60000, 60000);

    await this.browser.manage().addCookie({ name: Cookie.visitor, value: cookies[Cookie.visitor] });
    await this.browser.manage().addCookie({ name: Cookie.sIdentity, value: cookies[Cookie.sIdentity] });

    if (cookies.identity) {
      await this.browser.manage().addCookie({ name: Cookie.identity, value: cookies[Cookie.identity] as string });
    }

    // Log in Flex via service login
    await this.browser.get(flexBaseUrl);
    const link = await this.elementExists(this.pageObjects.flex.loginPage.serviceLoginLink, 'Service Login link');
    await link.click();

    // Making sure that agent desktop loads
    await this.elementExistsAndIsVisible(
      this.pageObjects.flex.agentDesktop.noTaskCanvas,
      'No Task Canvas',
      60000,
      60000,
    );
  }

  /**
   * Checks that element exists in DOM and is visible in UI
   */
  private static async elementExistsAndIsVisible(
    locator: By,
    elementName: string,
    existTimeout = 10000,
    visibleTimeout = 10000,
  ): Promise<void> {
    const element = await this.elementExists(locator, elementName, existTimeout);
    await this.elementIsVisible(element, elementName, visibleTimeout);
  }

  /**
   * Check that element exists in the DOM
   */
  private static async elementExists(locator: By, elementName: string, timeout = 10000): Promise<WebElement> {
    let element: WebElement;
    try {
      element = await this.browser.wait(until.elementLocated(locator), timeout, `Could not find ${elementName} in DOM`);
    } catch (e) {
      logger.error(`Did not find locator [${locator}] for element: ${elementName} in DOM`);
      throw new Error(e);
    }
    return element;
  }

  /**
   * Check that element is visible
   */
  private static async elementIsVisible(element: WebElement, elementName: string, timeout = 10000): Promise<void> {
    try {
      await this.browser.wait(until.elementIsVisible(element), timeout, `Could not find ${elementName} in DOM`);
    } catch (e) {
      logger.error(`Element: ${elementName} is not visible in the UI`);
      throw new Error(e);
    }
  }
}
