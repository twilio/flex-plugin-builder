/* eslint-disable multiline-comment-style */
import { mkdirSync, existsSync } from 'fs';

import { logger } from 'flex-plugins-utils-logger';
import { launch, Browser as PuppeteerBrowser, Page, ElementHandle } from 'puppeteer';

import { Cookies, Cookie } from './console-api';
import { testParams } from '../core';
import { joinPath } from '.';

const DEFAULT_LOCATE_TIMEOUT = 20000;
const DEFAULT_PAGE_LOAD_TIMEOUT = 60000;
const SCREENSHOT_DIR = 'screenshots';

enum SelectorType {
  css = 'css',
  xpath = 'xpath',
}

interface Selector {
  value: string;
  type: SelectorType;
}

interface PluginResponse {
  name: string;
  version: string;
  phase: number;
  src: string;
}

export class Browser {
  static pageObjects = {
    console: {
      loginPage: {
        form: { value: "form[method='post'", type: SelectorType.css },
      },
    },
    flex: {
      agentDesktop: {
        plugin: (pluginText: string): Selector => {
          return { value: `//div[contains(text(), '${pluginText}')]`, type: SelectorType.xpath };
        },
        noTaskCanvas: { value: '.Twilio-NoTasksCanvas', type: SelectorType.css },
      },
      adminDashboard: {
        welcomeBanner: { value: '.welcome-banner', type: SelectorType.css },
        projectName: { value: '#project-switcher-btn > span', type: SelectorType.css },
      },
      plugins: {
        list: { value: 'pre', type: SelectorType.css },
      },
    },
  };

  static assert = {
    pluginIsVisible: async (pluginComponentText: string): Promise<void> => Browser.pluginIsVisible(pluginComponentText),
    userIsOnView: async (view: string): Promise<void> => Browser.userIsOnView(view),
  };

  private static browser: PuppeteerBrowser;

  private static page: Page;

  /**
   * Initializes browser object
   */
  static async create(): Promise<void> {
    this.browser = await launch({ headless: false, args: ['--use-fake-ui-for-media-stream'] });
    this.page = await this.browser.newPage();
    // await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setRequestInterception(true);

    this.page.on(
      'request',
      async (request): Promise<void> => {
        if (
          request.resourceType() === 'script' &&
          !request.url().includes('twilio') &&
          !request.url().includes('localhost') &&
          !request.url().includes('unpkg')
        ) {
          return request.abort();
        }
        return request.continue();
      },
    );
  }

  static async kill(): Promise<void> {
    try {
      await this.browser.close();
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
    flexPath: string,
  ): Promise<void> {
    const path = `console/flex/service-login/${testParams.secrets.api.accountSid}/?path=/${flexPath}&referer=${
      flexBaseUrl.includes('localhost') ? 'http://localhost:3000&localPort=3000' : flexBaseUrl
    }`;

    // Open Twilio console to set cookies
    await this.open(consoleBaseUrl, path);
    await this.elementExistsAndIsVisible(
      this.pageObjects.console.loginPage.form,
      'Login form',
      DEFAULT_PAGE_LOAD_TIMEOUT,
    );

    const requiredCookies = [
      { name: Cookie.visitor, value: cookies[Cookie.visitor] },
      { name: Cookie.sIdentity, value: cookies[Cookie.sIdentity] },
    ];

    if (cookies.identity) {
      requiredCookies.push({ name: Cookie.identity, value: cookies[Cookie.identity] as string });
    }

    // Set console cookies
    await this.page.setCookie(...requiredCookies);

    // Log in Flex via service login
    await this.open(consoleBaseUrl, path);
  }

  /**
   * Takes screenshot of the browser
   * @param rootDir directory under which to store screenshots
   * @param screenshotName name by which to save the screenshot
   */
  static async takeScreenshot(rootDir: string, screenshotName = 'on_failure.png'): Promise<void> {
    const screenshotDir = joinPath(rootDir, SCREENSHOT_DIR);

    if (!screenshotName.endsWith('.png')) {
      screenshotName += '.png';
    }

    if (!existsSync(screenshotDir)) {
      mkdirSync(screenshotDir);
    }

    await this.page.screenshot({ path: joinPath(screenshotDir, screenshotName) });
  }

  /**
   * Open the given path in browser
   * @param baseUrl base url
   * @param path path to navigate to
   */
  static async open(flexBaseUrl: string, path: string): Promise<void> {
    await this.page.goto(`${flexBaseUrl}/${path}`);
  }

  /**
   * Gets account sid from browser's console
   */
  // static async getFlexAccountSid(): Promise<string> {
  //   return this.browser.executeScript<string>(
  //     'return Twilio.Flex.Manager.getInstance().serviceConfiguration.account_sid',
  //   );
  // }

  /**
   * Prints all logs with level SEVERE
   */
  // static async printLogs(): Promise<void> {
  //   const logTypes = await this.getAvailableLogTypes();
  //   const browserLogType = logging.Type.BROWSER;

  //   if (logTypes.includes(browserLogType)) {
  //     const allLogs = await this.browser.manage().logs().get(browserLogType);
  //     const severeLogs = allLogs.filter((e) => e.level === logging.Level.SEVERE);

  //     if (severeLogs.length) {
  //       logger.info('Browser logs');
  //       severeLogs.forEach((entry) => {
  //         const { message, timestamp } = entry;
  //         logger.error({
  //           message,
  //           timestamp,
  //         });
  //       });
  //     }
  //   } else {
  //     logger.warning(`${browserLogType} logs are not available`);
  //   }
  // }

  /**
   * Returns all plugins from the /plugins endpoint
   * @param flexBaseUrl base url of the Flex
   */
  static async getPluginResponse(flexBaseUrl: string): Promise<PluginResponse[]> {
    await this.open(flexBaseUrl, 'plugins');

    const pluginListEle = await this.elementExistsAndIsVisible(
      this.pageObjects.flex.plugins.list,
      'Plugin list in /plugins',
    );

    const pluginListString = await this.getText(pluginListEle, 'Plugin list');

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
   * Gets account sid from browser's console
   */
  static async getFlexAccountSid(): Promise<string> {
    let Twilio: any;
    return <Promise<string>>this.page.evaluate(() => {
      return Twilio.Flex.Manager.getInstance().serviceConfiguration.account_sid;
    });
  }

  /**
   * Gets all available log types from the browser
   */
  // private static async getAvailableLogTypes(): Promise<string[]> {
  //   try {
  //     return await this.browser.manage().logs().getAvailableLogTypes();
  //   } catch (e) {
  //     logger.warning('Failed to retrieve log types');
  //     return [];
  //   }
  // }

  /**
   * Checks that plugin exists in DOM and is visible in UI
   * @param pluginComponentText text to identify plugin by
   */
  // private static async pluginIsVisible(pluginComponentText: string): Promise<void> {
  //   await this.elementExistsAndIsVisible(
  //     this.pageObjects.flex.agentDesktop.plugin(pluginComponentText),
  //     'Plugin element',
  //   );
  // }

  // /**
  //  * Ensures that user is on the correct view
  //  * @param view name of view on which user should be
  //  */
  // private static async userIsOnView(view: FlexView): Promise<void> {
  //   let locator: By;

  //   if (view === 'Admin Dashboard') {
  //     locator = this.pageObjects.flex.adminDashboard.welcomeBanner;
  //   } else if (view === 'Agent Desktop') {
  //     locator = this.pageObjects.flex.agentDesktop.noTaskCanvas;
  //   } else {
  //     throw new Error(`${view} is not a valid view`);
  //   }

  //   await this.elementExistsAndIsVisible(locator, view, DEFAULT_PAGE_LOAD_TIMEOUT, DEFAULT_PAGE_LOAD_TIMEOUT);
  // }

  /**
   * Checks that element exists in DOM and is visible in UI
   * @param locator selector wrapped in By
   * @param elementName name of the searchable element
   * @param existTimeout time to wait for until element is located in DOM
   * @param visibleTimeout time to wait for until element is visible in the UI
   */
  // private static async elementExistsAndIsVisible(
  //   locator: By,
  //   elementName: string,
  //   existTimeout = DEFAULT_LOCATE_TIMEOUT,
  //   visibleTimeout = DEFAULT_LOCATE_TIMEOUT,
  // ): Promise<void> {
  //   const element = await this.elementExists(locator, elementName, existTimeout);
  //   await this.elementIsVisible(element, elementName, visibleTimeout);
  // }

  /**
   * Check that element exists in the DOM
   * @param locator selector wrapped in By
   * @param elementName name of the searchable element
   * @param timeout time to wait for until element is located in DOM
   */
  // private static async elementExists(
  //   locator: By,
  //   elementName: string,
  //   timeout = DEFAULT_LOCATE_TIMEOUT,
  // ): Promise<WebElement> {
  //   try {
  //     return await this.browser.wait(until.elementLocated(locator), timeout, `Could not find ${elementName} in DOM`);
  //   } catch (e) {
  //     logger.error(`Did not find locator [${locator}] for element: ${elementName} in DOM`);
  //     throw new Error(JSON.stringify(e));
  //   }
  // }

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
  private static async userIsOnView(view: string): Promise<void> {
    let selector: Selector;

    if (view === 'Admin Dashboard') {
      selector = this.pageObjects.flex.adminDashboard.welcomeBanner;
    } else if (view === 'Agent Desktop') {
      selector = this.pageObjects.flex.agentDesktop.noTaskCanvas;
    } else {
      throw new Error(`${view} is not a valid view`);
    }

    await this.elementExistsAndIsVisible(selector, view, DEFAULT_PAGE_LOAD_TIMEOUT);
  }

  /**
   * Check that element exists and is visible
   * @param selector element which should be visible
   * @param elementName name of the searchable element
   * @param timeout time to wait for until element is visible in the UI
   */
  private static async elementExistsAndIsVisible(
    seletor: Selector,
    elementName: string,
    timeout = DEFAULT_LOCATE_TIMEOUT,
  ): Promise<ElementHandle<Element>> {
    let element: ElementHandle<Element> | null;

    if (seletor.type === SelectorType.css) {
      element = await this.page.waitForSelector(seletor.value, {
        timeout,
      });
    } else {
      element = await this.page.waitForXPath(seletor.value, {
        timeout,
      });
    }

    if (!element) {
      throw new Error(`Element: ${elementName} is not visible in the UI`);
    }
    return element;
  }

  private static async getText(element: ElementHandle<Element>, elementName: string): Promise<string> {
    const text = await element.evaluate((el) => el.textContent);

    if (!text) {
      throw new Error(`${elementName} does not contain any text`);
    }

    return text;
  }
}

// waitForElement() {
//   //
// }

/**
 * Manages instantiation and interactions with browser
 */
// export class Browser {
//   static browser: WebDriver;

// static pageObjects = {
//   console: {
//     loginPage: {
//       form: By.css("form[method='post'"),
//     },
//   },
//   flex: {
//     agentDesktop: {
//       plugin: (pluginText: string): By => By.xpath(`//div[contains(text(), '${pluginText}')]`),
//       noTaskCanvas: By.css('.Twilio-NoTasksCanvas'),
//     },
//     adminDashboard: {
//       welcomeBanner: By.css('.welcome-banner'),
//       projectName: By.css('#project-switcher-btn > span'),
//     },
//     plugins: {
//       list: By.css('pre'),
//     },
//   },
// };

// static assert = {
//   pluginIsVisible: async (pluginComponentText: string): Promise<void> => Browser.pluginIsVisible(pluginComponentText),
//   userIsOnView: async (view: string): Promise<void> => Browser.userIsOnView(view),
// };

// /**
//  * Gets account sid from browser's console
//  */
// static async getFlexAccountSid(): Promise<string> {
//   return this.browser.executeScript<string>(
//     'return Twilio.Flex.Manager.getInstance().serviceConfiguration.account_sid',
//   );
// }

// /**
//  * Initializes browser object
//  */
// static async create(): Promise<void> {
//   const opts = new chrome.Options();

//   opts.addArguments(
//     'allow-file-access-from-files',
//     'use-fake-device-for-media-stream',
//     'use-fake-ui-for-media-stream',
//     '--disable-web-security',
//     '--allow-file-access',
//     '--headless',
//     'no-sandbox',
//   );

//   await new Builder()
//     .withCapabilities({ browserName: 'chrome' })
//     .setChromeOptions(opts)
//     .build()
//     .then((driver) => {
//       this.browser = driver;
//     })
//     .catch((e) => {
//       throw e;
//     });
// }

// /**
//  * Prints all logs with level SEVERE
//  */
// static async printLogs(): Promise<void> {
//   const logTypes = await this.getAvailableLogTypes();
//   const browserLogType = logging.Type.BROWSER;

//   if (logTypes.includes(browserLogType)) {
//     const allLogs = await this.browser.manage().logs().get(browserLogType);
//     const severeLogs = allLogs.filter((e) => e.level === logging.Level.SEVERE);

//     if (severeLogs.length) {
//       logger.info('Browser logs');
//       severeLogs.forEach((entry) => {
//         const { message, timestamp } = entry;
//         logger.error({
//           message,
//           timestamp,
//         });
//       });
//     }
//   } else {
//     logger.warning(`${browserLogType} logs are not available`);
//   }
// }

// /**
//  * Takes screenshot of the browser
//  * @param rootDir directory under which to store screenshots
//  * @param screenshotName name by which to save the screenshot
//  */
// static async takeScreenshot(rootDir: string, screenshotName = 'on_failure.png'): Promise<void> {
//   const screenshotDir = joinPath(rootDir, SCREENSHOT_DIR);

//   if (!screenshotName.endsWith('.png')) {
//     screenshotName += '.png';
//   }

//   if (!existsSync(screenshotDir)) {
//     mkdirSync(screenshotDir);
//   }

//   writeFileSync(joinPath(screenshotDir, screenshotName), await this.browser.takeScreenshot(), 'base64');
// }

// /**
//  * Attempts to quit browser. Doesn't throw on failure
//  */
// static async kill(): Promise<void> {
//   try {
//     await this.browser.quit();
//   } catch (e) {
//     logger.error('Failed to quit browser');
//   }
// }

// /**
//  * Sets console cookies and logs into Flex via service login
//  * @param cookies cookies to set
//  * @param consoleBaseUrl Twilio console base url
//  * @param flexBaseUrl base url of the flex
//  * @param flexPath flex path to navigate to after logging in
//  */
// static async loginViaConsole(
//   cookies: Cookies,
//   consoleBaseUrl: string,
//   flexBaseUrl: string,
//   flexPath: FlexPath,
// ): Promise<void> {
//   const serviceLoginUrl = `${consoleBaseUrl}/console/flex/service-login/${
//     testParams.secrets.api.accountSid
//   }/?path=/${flexPath}&referer=${
//     flexBaseUrl.includes('localhost') ? 'http://localhost:3000&localPort=3000' : flexBaseUrl
//   }`;

//   // Open Twilio console to set cookies
//   await this.browser.get(serviceLoginUrl);
//   await this.elementExistsAndIsVisible(
//     this.pageObjects.console.loginPage.form,
//     'Login Form',
//     DEFAULT_PAGE_LOAD_TIMEOUT,
//     DEFAULT_PAGE_LOAD_TIMEOUT,
//   );

//   // Set console cookies
//   await this.browser.manage().addCookie({ name: Cookie.visitor, value: cookies[Cookie.visitor] });
//   await this.browser.manage().addCookie({ name: Cookie.sIdentity, value: cookies[Cookie.sIdentity] });

//   if (cookies.identity) {
//     await this.browser.manage().addCookie({ name: Cookie.identity, value: cookies[Cookie.identity] as string });
//   }

//   // Log in Flex via service login
//   await this.browser.get(serviceLoginUrl);
// }

// /**
//  * Open the given path in browser
//  * @param flexBaseUrl base url of the Flex
//  * @param path path to navigate to
//  */
// static async navigate(flexBaseUrl: string, path: FlexPath): Promise<void> {
//   await this.browser.get(`${flexBaseUrl}/${path}`);
// }

// /**
//  * Returns all plugins from the /plugins endpoint
//  * @param flexBaseUrl base url of the Flex
//  */
// static async getPluginResponse(flexBaseUrl: string): Promise<PluginResponse[]> {
//   await this.browser.get(`${flexBaseUrl}/plugins`);

//   const pluginListEle = await this.elementExists(this.pageObjects.flex.plugins.list, 'Plugin List PRE block');
//   const pluginListString = await pluginListEle.getText();

//   let pluginList;
//   try {
//     pluginList = JSON.parse(pluginListString);
//   } catch (e) {
//     logger.error('Plugin list retrieved from the /plugins is not a valid JSON');
//     throw e;
//   }
//   return pluginList;
// }

// /**
//  * Gets all available log types from the browser
//  */
// private static async getAvailableLogTypes(): Promise<string[]> {
//   try {
//     return await this.browser.manage().logs().getAvailableLogTypes();
//   } catch (e) {
//     logger.warning('Failed to retrieve log types');
//     return [];
//   }
// }

// /**
//  * Checks that plugin exists in DOM and is visible in UI
//  * @param pluginComponentText text to identify plugin by
//  */
// private static async pluginIsVisible(pluginComponentText: string): Promise<void> {
//   await this.elementExistsAndIsVisible(
//     this.pageObjects.flex.agentDesktop.plugin(pluginComponentText),
//     'Plugin element',
//   );
// }

// /**
//  * Ensures that user is on the correct view
//  * @param view name of view on which user should be
//  */
// private static async userIsOnView(view: FlexView): Promise<void> {
//   let locator: By;

//   if (view === 'Admin Dashboard') {
//     locator = this.pageObjects.flex.adminDashboard.welcomeBanner;
//   } else if (view === 'Agent Desktop') {
//     locator = this.pageObjects.flex.agentDesktop.noTaskCanvas;
//   } else {
//     throw new Error(`${view} is not a valid view`);
//   }

//   await this.elementExistsAndIsVisible(locator, view, DEFAULT_PAGE_LOAD_TIMEOUT, DEFAULT_PAGE_LOAD_TIMEOUT);
// }

// /**
//  * Checks that element exists in DOM and is visible in UI
//  * @param locator selector wrapped in By
//  * @param elementName name of the searchable element
//  * @param existTimeout time to wait for until element is located in DOM
//  * @param visibleTimeout time to wait for until element is visible in the UI
//  */
// private static async elementExistsAndIsVisible(
//   locator: By,
//   elementName: string,
//   existTimeout = DEFAULT_LOCATE_TIMEOUT,
//   visibleTimeout = DEFAULT_LOCATE_TIMEOUT,
// ): Promise<void> {
//   const element = await this.elementExists(locator, elementName, existTimeout);
//   await this.elementIsVisible(element, elementName, visibleTimeout);
// }

// /**
//  * Check that element exists in the DOM
//  * @param locator selector wrapped in By
//  * @param elementName name of the searchable element
//  * @param timeout time to wait for until element is located in DOM
//  */
// private static async elementExists(
//   locator: By,
//   elementName: string,
//   timeout = DEFAULT_LOCATE_TIMEOUT,
// ): Promise<WebElement> {
//   try {
//     return await this.browser.wait(until.elementLocated(locator), timeout, `Could not find ${elementName} in DOM`);
//   } catch (e) {
//     logger.error(`Did not find locator [${locator}] for element: ${elementName} in DOM`);
//     throw new Error(JSON.stringify(e));
//   }
// }

// /**
//  * Check that element is visible
//  * @param element element which should be visible
//  * @param elementName name of the searchable element
//  * @param timeout time to wait for until element is visible in the UI
//  */
// private static async elementIsVisible(
//   element: WebElement,
//   elementName: string,
//   timeout = DEFAULT_LOCATE_TIMEOUT,
// ): Promise<void> {
//   try {
//     await this.browser.wait(until.elementIsVisible(element), timeout, `Could not find ${elementName} in DOM`);
//   } catch (e) {
//     logger.error(`Element: ${elementName} is not visible in the UI`);
//     throw new Error(JSON.stringify(e));
//   }
// }
// }
