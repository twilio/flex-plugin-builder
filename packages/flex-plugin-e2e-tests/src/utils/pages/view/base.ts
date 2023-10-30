import { ElementHandle, Page } from 'puppeteer';
import { logger } from '@twilio/flex-dev-utils';

const { LOCATE_TIMEOUT } = process.env;
const { PAGE_LOAD_TIMEOUT } = process.env;

export abstract class Base {
  protected static readonly DEFAULT_LOCATE_TIMEOUT = LOCATE_TIMEOUT ? Number(LOCATE_TIMEOUT) : 60000;

  protected static readonly DEFAULT_PAGE_LOAD_TIMEOUT = PAGE_LOAD_TIMEOUT ? Number(PAGE_LOAD_TIMEOUT) : 60000;

  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    logger.info(
      `DEFAULT_LOCATE_TIMEOUT: ${Base.DEFAULT_LOCATE_TIMEOUT}ms DEFAULT_PAGE_LOAD_TIMEOUT: ${Base.DEFAULT_PAGE_LOAD_TIMEOUT}`,
    );
  }

  /**
   * Navigate to the given url
   * @param baseUrl
   * @param path
   */
  protected async goto({ baseUrl, path }: { baseUrl: string; path?: string }): Promise<void> {
    const fullPath = path ? `${baseUrl}/${path}` : baseUrl;
    logger.info(`Going to path: ${fullPath}`);
    const res = await this.page.goto(fullPath, { waitUntil: 'load', timeout: Base.DEFAULT_PAGE_LOAD_TIMEOUT });
    logger.info(`Goto response is ${res?.status} and whole response is `, res);
  }

  /**
   * Get text from an element
   * @param element
   * @param elementName
   */
  protected async getText(element: ElementHandle<Node>, elementName: string): Promise<string> {
    const text = await element.evaluate((el) => el.textContent);

    if (!text) {
      throw new Error(`${elementName} does not contain any text`);
    }

    return text;
  }

  /**
   * Input value into an element
   * @param element
   * @param value
   */
  protected async inputText(selector: string, value: string): Promise<void> {
    const element = await this.elementVisible(selector, selector.substring(1));
    if (element) {
      await this.page.type(selector, value);
    } else {
      throw new Error('Something went wrong while entering value');
    }
  }

  /**
   * Click on an element
   * @param element
   */
  protected async click(selector: string): Promise<void> {
    const element = await this.elementVisible(selector, selector.substring(1));
    if (element) {
      await this.page.click(selector);
    } else {
      throw new Error('Something went wrong while clicking a button');
    }
  }

  /**
   * Check that element exists and is visible
   * @param selector element which should be visible
   * @param elementName name of the searchable element
   * @param timeout time to wait for until element is visible in the UI
   */
  protected async elementVisible(
    seletor: string,
    elementName: string,
    timeout = Base.DEFAULT_LOCATE_TIMEOUT,
  ): Promise<ElementHandle<Node> | ElementHandle<Element>> {
    const waitOptions = { timeout };

    logger.info(`seletor:${seletor} elementName:${elementName} timeout:${timeout}`);
    // Extremely naive check
    const element = seletor.startsWith('//')
      ? await this.page.waitForXPath(seletor, waitOptions)
      // @ts-ignore
      : await this.page.waitForSelector(seletor, waitOptions);

    if (!element) {
      throw new Error(`Element: ${elementName} is not visible in the UI`);
    }
    return element;
  }
}
