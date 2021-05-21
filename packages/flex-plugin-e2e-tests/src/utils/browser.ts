import { logger } from 'flex-plugins-utils-logger';
import { Builder, WebDriver, WebElement, until, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

import { Cookies, Cookie } from './console-api';

const DEFAULT_LOCATE_TIMEOUT = 15000;
const DEFAULT_PAGE_LOAD_TIMEOUT = 60000;

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
   * Checks that plugin exists in DOM and is visible in UI
   * @param pluginComponentText text to identify plugin by
   */
  static async pluginIsVisible(pluginComponentText: string): Promise<void> {
    await this.elementExistsAndIsVisible(
      this.pageObjects.flex.agentDesktop.plugin(pluginComponentText),
      'Plugin element',
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
   * @param cookies cookies to set
   * @param consoleBaseUrl Twilio console base url
   * @param flexBaseUrl base url of the flex
   */
  static async loginViaConsole(cookies: Cookies, consoleBaseUrl: string, flexBaseUrl: string): Promise<void> {
    // Set console cookies
    await this.browser.get(`${consoleBaseUrl}/login`);
    await this.elementExistsAndIsVisible(
      this.pageObjects.console.loginPage.form,
      'Login Form',
      DEFAULT_PAGE_LOAD_TIMEOUT,
      DEFAULT_PAGE_LOAD_TIMEOUT,
    );

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
      DEFAULT_PAGE_LOAD_TIMEOUT,
      DEFAULT_PAGE_LOAD_TIMEOUT,
    );
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
